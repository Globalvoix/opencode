// Thinksoft Clerk sign-in helpers (renderer side).
//
// The desktop app has no backend, so it follows the same loopback pattern as
// Cursor/VS Code: the system browser completes Clerk SSO, hands a short-lived
// Clerk session JWT back over loopback, the app verifies that JWT against
// Clerk's JWKS, and only then mints its own local session (stored in the main
// process). The publishable key is public by design; no secret ever ships
// with the app.

// Test instance key. Override at build time with VITE_CLERK_PUBLISHABLE_KEY.
const DEFAULT_PUBLISHABLE_KEY =
  "pk_test_dXNhYmxlLWxhZHliaXJkLTM1LmNsZXJrLmFjY291bnRzLmRldiQ"

export function resolvePublishableKey() {
  const configured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  if (typeof configured === "string" && configured !== "") return configured
  return DEFAULT_PUBLISHABLE_KEY
}

export function randomState() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function frontendApiDomain(publishableKey: string) {
  try {
    return atob(publishableKey.split("_")[2] ?? "").slice(0, -1)
  } catch {
    return ""
  }
}

function base64UrlDecode(input: string) {
  const padded = input.replaceAll("-", "+").replaceAll("_", "/")
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export type VerifiedToken = {
  userId: string
}

// Verify a Clerk session JWT signature against Clerk's JWKS and check its
// issuer, subject, and expiry. Throws when the token cannot be trusted.
export async function verifyClerkSessionToken(token: string, publishableKey: string): Promise<VerifiedToken> {
  const domain = frontendApiDomain(publishableKey)
  if (domain === "") throw new Error("Invalid Clerk publishable key.")
  const parts = token.split(".")
  const [encodedHeader, encodedPayload, encodedSignature] = parts
  if (parts.length !== 3 || !encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error("Malformed authorization token.")
  }
  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedHeader))) as {
    kid?: unknown
    alg?: unknown
  }
  if (header.alg !== "RS256" || typeof header.kid !== "string") {
    throw new Error("Unexpected authorization token algorithm.")
  }
  const jwksResponse = await fetch(`https://${domain}/.well-known/jwks.json`)
  if (!jwksResponse.ok) throw new Error("Unable to fetch sign-in keys. Check your connection and retry.")
  const jwks = (await jwksResponse.json()) as { keys?: JsonWebKey[] }
  const jwk = jwks.keys?.find((candidate) => candidate.kid === header.kid && candidate.kty === "RSA")
  if (jwk === undefined) throw new Error("Unknown authorization token signing key.")
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  )
  const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  const signatureValid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, base64UrlDecode(encodedSignature), data)
  if (!signatureValid) throw new Error("Authorization token signature is invalid.")
  const claims = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as {
    iss?: unknown
    sub?: unknown
    exp?: unknown
    nbf?: unknown
  }
  const nowSeconds = Math.floor(Date.now() / 1000)
  if (claims.iss !== `https://${domain}`) throw new Error("Unexpected authorization token issuer.")
  if (typeof claims.sub !== "string" || claims.sub === "") throw new Error("Authorization token has no subject.")
  if (typeof claims.exp !== "number" || claims.exp <= nowSeconds) {
    throw new Error("Authorization token has expired. Please sign in again.")
  }
  if (typeof claims.nbf === "number" && claims.nbf > nowSeconds + 30) {
    throw new Error("Authorization token is not yet valid.")
  }
  return { userId: claims.sub }
}

export function clerkMessage(cause: unknown, fallback: string) {
  if (typeof cause === "object" && cause !== null && "errors" in cause) {
    const errors = (cause as { errors?: { message?: unknown }[] }).errors
    const first = errors?.[0]?.message
    if (typeof first === "string" && first !== "") return first
  }
  if (cause instanceof Error && cause.message !== "") return cause.message
  return fallback
}

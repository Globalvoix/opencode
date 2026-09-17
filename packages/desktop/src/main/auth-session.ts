// Pure Thinksoft auth session helpers (no Electron imports, unit testable).

export type AuthSession = {
  userId: string
  email: string
  expiresAt: number
}

export const AUTH_SESSION_TTL = 30 * 24 * 60 * 60 * 1000
export const MAX_EMAIL_LENGTH = 320

export function parseAuthSession(value: unknown, now = Date.now()): AuthSession | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  if (typeof record.userId !== "string" || record.userId === "") return null
  if (typeof record.email !== "string" || record.email === "") return null
  if (typeof record.expiresAt !== "number" || record.expiresAt <= now) return null
  return { userId: record.userId, email: record.email, expiresAt: record.expiresAt }
}

export function createAuthSession(userId: string, email: string, now = Date.now()): AuthSession {
  if (userId === "" || email === "" || email.length > MAX_EMAIL_LENGTH) {
    throw new Error("Invalid auth session")
  }
  return { userId, email, expiresAt: now + AUTH_SESSION_TTL }
}

export function frontendApiDomain(publishableKey: string) {
  try {
    return Buffer.from(publishableKey.split("_")[2] ?? "", "base64").toString("utf8").slice(0, -1)
  } catch {
    return ""
  }
}

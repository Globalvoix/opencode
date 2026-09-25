// Streams a published installer with a Thinksoft filename.
//
// A browser saves a download under the name the response's Content-Disposition
// carries, so a file served straight from the upstream bucket keeps its upstream
// name (opencode-desktop-win-x64.exe). This route renames it without buffering, so a
// 200 MB installer still streams and range requests keep working.
//
// Vercel Edge Function, reached at /api/downloads/<artifact>. The site only uses it
// when built with VITE_DOWNLOAD_ROUTE=proxy; the default links straight at the bucket.
// Configure with DOWNLOAD_ORIGIN and DOWNLOAD_VERSION (see README).

const ORIGIN = "https://opencode.ai"
const VERSION = "2.0.16"

// Upstream artifact name -> the name the visitor's browser saves.
const BRANDED: Record<string, string> = {
  "opencode-desktop-win-x64.exe": "Thinksoft-Setup-x64.exe",
  "opencode-desktop-win-arm64.exe": "Thinksoft-Setup-arm64.exe",
  "opencode-desktop-mac-arm64.dmg": "Thinksoft-Apple-Silicon.dmg",

  "opencode-desktop-mac-x64.dmg": "Thinksoft-Intel.dmg",

  "opencode-desktop-linux-x86_64.AppImage": "Thinksoft-x86_64.AppImage",
  "opencode-desktop-linux-arm64.AppImage": "Thinksoft-arm64.AppImage",
  "opencode-desktop-linux-amd64.deb": "Thinksoft-amd64.deb",
  "opencode-desktop-linux-arm64.deb": "Thinksoft-arm64.deb",
  "opencode-desktop-linux-x86_64.rpm": "Thinksoft-x86_64.rpm",
  "opencode-desktop-linux-aarch64.rpm": "Thinksoft-aarch64.rpm",
}

export const config = { runtime: "edge" }

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const artifact = decodeURIComponent(url.pathname.replace(/^\/api\/downloads\//, "").replace(/^\/+/, ""))
  const name = BRANDED[artifact]
  // Only the known installers are proxied, so this cannot become an open relay.
  if (!name || artifact.includes("..")) return new Response("Not found", { status: 404 })

  const origin = (process.env.DOWNLOAD_ORIGIN || ORIGIN).replace(/\/$/, "")
  const version = process.env.DOWNLOAD_VERSION || VERSION
  const range = request.headers.get("range")

  const upstream = await fetch(`${origin}/files/bin/${version}/${artifact}`, {
    headers: range ? { range } : {},
  })
  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Download unavailable", { status: upstream.status })
  }

  const headers = new Headers()
  for (const key of ["content-type", "content-length", "content-range", "accept-ranges", "etag", "last-modified"]) {
    const value = upstream.headers.get(key)
    if (value) headers.set(key, value)
  }
  headers.set("content-disposition", `attachment; filename="${name}"`)
  headers.set("cache-control", "public, max-age=3600")

  return new Response(upstream.body, { status: upstream.status, headers })
}

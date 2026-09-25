// Streams a published installer with a Thinksoft filename.
//
// The browser names a download after the response's Content-Disposition, so a file
// served straight from the upstream bucket keeps its upstream name
// (opencode-desktop-win-x64.exe). Routing downloads through this function renames
// them without buffering the file in memory, so a 200 MB installer still streams.
//
// This is a Cloudflare Pages Function. It is only used when the site is built with
// VITE_DOWNLOAD_ROUTE=proxy; the default route links straight at the bucket.
// Configure with DOWNLOAD_ORIGIN and DOWNLOAD_VERSION (see README).

interface Env {
  DOWNLOAD_ORIGIN?: string
  DOWNLOAD_VERSION?: string
}

interface PagesEvent {
  params: { path?: string | string[] }
  request: Request
  env: Env
}

const ORIGIN = "https://opencode.ai"
const VERSION = "2.0.16"

// Upstream artifact name -> the name the visitor's browser saves.
const BRANDED: Record<string, string> = {
  "opencode-desktop-win-x64.exe": "Thinksoft-Setup-x64.exe",
  "opencode-desktop-win-arm64.exe": "Thinksoft-Setup-arm64.exe",
  "opencode-desktop-mac-arm64.dmg": "Thinksoft-Apple-Silicon.dmg",
  "opencode-desktop-mac-arm64.zip": "Thinksoft-Apple-Silicon.zip",
  "opencode-desktop-mac-x64.dmg": "Thinksoft-Intel.dmg",
  "opencode-desktop-mac-x64.zip": "Thinksoft-Intel.zip",
  "opencode-desktop-linux-x86_64.AppImage": "Thinksoft-x86_64.AppImage",
  "opencode-desktop-linux-arm64.AppImage": "Thinksoft-arm64.AppImage",
  "opencode-desktop-linux-amd64.deb": "Thinksoft-amd64.deb",
  "opencode-desktop-linux-arm64.deb": "Thinksoft-arm64.deb",
  "opencode-desktop-linux-x86_64.rpm": "Thinksoft-x86_64.rpm",
  "opencode-desktop-linux-aarch64.rpm": "Thinksoft-aarch64.rpm",
}

export async function onRequestGet({ params, request, env }: PagesEvent) {
  const artifact = Array.isArray(params.path) ? params.path.join("/") : (params.path ?? "")
  const name = BRANDED[artifact]
  // Only the known installers are proxied, so this cannot become an open relay.
  if (!name) return new Response("Not found", { status: 404 })

  const origin = env.DOWNLOAD_ORIGIN ?? ORIGIN
  const version = env.DOWNLOAD_VERSION ?? VERSION
  const upstream = await fetch(`${origin}/files/bin/${version}/${artifact}`, {
    headers: { range: request.headers.get("range") ?? "" },
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

  // Forwarded as a stream: nothing is buffered, so range requests and progress
  // reporting behave the same as downloading the file directly.
  return new Response(upstream.body, { status: upstream.status, headers })
}

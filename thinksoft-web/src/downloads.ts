// Every installer the release pipeline publishes, in one place.
//
// The desktop release workflow (packages/desktop/electron-builder.config.ts) builds
// `thinksoft-desktop-${os}-${arch}.${ext}` and publishes each file under
// /files/bin/<version>/. Releases published before the rebrand used the
// `opencode-desktop-` prefix, so the prefix is configurable: keep the default until a
// Thinksoft-named release exists at the base URL, then set
// VITE_ARTIFACT_PREFIX=thinksoft-desktop (or nothing, once the default flips).
export const DESKTOP_VERSION = import.meta.env.VITE_DESKTOP_VERSION || "2.0.16"

const ARTIFACT_PREFIX = import.meta.env.VITE_ARTIFACT_PREFIX || "opencode-desktop"

const BASE = (import.meta.env.VITE_DOWNLOAD_BASE_URL || `https://opencode.ai/files/bin/${DESKTOP_VERSION}/`).replace(
  /\/$/,
  "",
)

export type Platform = "windows" | "macos" | "linux"

export type Download = {
  id: string
  platform: Platform
  // Short name for the build, e.g. "Apple Silicon".
  title: string
  // Marketing hint shown under the title, e.g. "M1, M2, M3, M4 · .dmg".
  hint: string
  // Compact architecture label used where there is no room for the title.
  detail: string
  // Artifact name without the product prefix, e.g. "win-x64.exe".
  artifact: string
  size: number
  // Direct URL override. When set, this exact URL is served and the bucket
  // prefix, base and proxy route are skipped (e.g. a self-hosted installer).
  url?: string
}

// The saved filename is decided by the server that serves the file, so this is the
// name the browser will save. It is never shown in the UI.
export const downloadFile = (download: Download) => `${ARTIFACT_PREFIX}-${download.artifact}`

export const DOWNLOADS: Download[] = [
  {
    id: "win-x64",
    platform: "windows",
    title: "Windows x64",
    hint: "Intel / AMD 64-bit",
    detail: "64-bit (Intel, AMD)",
    artifact: "win-x64.exe",
    size: 231417943,
    url: "https://oyxvl9jk07gqqyjf.public.blob.vercel-storage.com/Thinksoft-Setup-x64.exe",
  },
  {
    id: "win-arm64",
    platform: "windows",
    title: "Windows ARM64",
    hint: "Snapdragon / Copilot+",
    detail: "ARM64 (Snapdragon)",
    artifact: "win-arm64.exe",
    size: 205818160,
  },
  {
    id: "mac-arm64-dmg",
    platform: "macos",
    title: "Apple Silicon",
    hint: "M1, M2, M3, M4 · .dmg",
    detail: "Apple Silicon",
    artifact: "mac-arm64.dmg",
    size: 233759656,
  },

  {
    id: "mac-x64-dmg",
    platform: "macos",
    title: "Intel 64-bit",
    hint: "x86_64 · .dmg",
    detail: "Intel",
    artifact: "mac-x64.dmg",
    size: 245709164,
  },

  {
    id: "linux-x64-appimage",
    platform: "linux",
    title: "AppImage (x86_64)",
    hint: "Any distro · .AppImage",
    detail: "x86_64 AppImage",
    artifact: "linux-x86_64.AppImage",
    size: 244431400,
  },
  {
    id: "linux-arm64-appimage",
    platform: "linux",
    title: "AppImage (ARM64)",
    hint: "Any distro · .AppImage",
    detail: "ARM64 AppImage",
    artifact: "linux-arm64.AppImage",
    size: 244398662,
  },
  {
    id: "linux-x64-deb",
    platform: "linux",
    title: "Debian / Ubuntu",
    hint: "x86_64 · .deb",
    detail: "x86_64 .deb",
    artifact: "linux-amd64.deb",
    size: 197543616,
  },
  {
    id: "linux-arm64-deb",
    platform: "linux",
    title: "Debian / Ubuntu (ARM64)",
    hint: "aarch64 · .deb",
    detail: "ARM64 .deb",
    artifact: "linux-arm64.deb",
    size: 189275464,
  },
  {
    id: "linux-x64-rpm",
    platform: "linux",
    title: "Fedora / RHEL",
    hint: "x86_64 · .rpm",
    detail: "x86_64 .rpm",
    artifact: "linux-x86_64.rpm",
    size: 166507649,
  },
  {
    id: "linux-arm64-rpm",
    platform: "linux",
    title: "Fedora / RHEL (ARM64)",
    hint: "aarch64 · .rpm",
    detail: "ARM64 .rpm",
    artifact: "linux-aarch64.rpm",
    size: 158826949,
  },
]

export const PLATFORM_LABELS: Record<Platform, string> = {
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
}

// The order sections appear on the download page.
export const PLATFORM_ORDER: Platform[] = ["macos", "windows", "linux"]

export const formatSize = (size: number) => `${Math.round(size / 1024 / 1024)} MB`

// "proxy" routes downloads through the site's own /downloads function, which renames
// the file to a Thinksoft name (see functions/downloads/[[path]].ts). "direct" links at
// the bucket, where the saved name is whatever that server sends.
const DOWNLOAD_ROUTE = import.meta.env.VITE_DOWNLOAD_ROUTE === "proxy" ? "proxy" : "direct"

export const downloadUrl = (download: Download) =>
  download.url ??
  (DOWNLOAD_ROUTE === "proxy" ? `/api/downloads/${downloadFile(download)}` : `${BASE}/${downloadFile(download)}`)

export const downloadsFor = (platform: Platform) => DOWNLOADS.filter((item) => item.platform === platform)

// The installer a visitor most likely wants: the default build for their OS and CPU.
export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows"
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? ""
  if (/mac/i.test(platform) || /Mac/i.test(navigator.userAgent)) return "macos"
  if (/linux/i.test(platform) || /X11/i.test(navigator.userAgent)) return "linux"
  return "windows"
}

export function detectArch(): "arm64" | "x64" {
  if (typeof navigator === "undefined") return "x64"
  return /arm64|aarch64/i.test(navigator.userAgent) ? "arm64" : "x64"
}

export function recommendedDownload(platform = detectPlatform()): Download {
  const arm = detectArch() === "arm64"
  const options = downloadsFor(platform)
  return (
    options.find((item) => {
      if (platform === "windows") return arm ? item.id === "win-arm64" : item.id === "win-x64"
      if (platform === "macos") return arm ? item.id === "mac-arm64-dmg" : item.id === "mac-x64-dmg"
      return arm ? item.id === "linux-arm64-appimage" : item.id === "linux-x64-appimage"
    }) ?? options[0]
  )
}

export function startDownload(download: Download) {
  const link = document.createElement("a")
  link.href = downloadUrl(download)
  link.rel = "noopener"
  // A plain navigation keeps the browser's own download UI, progress and resume
  // behaviour instead of trying to stream the file through a blob.
  link.click()
}

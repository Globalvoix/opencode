import type { Platform } from "@opencode/app/desktop"
import type { ElectronAPI } from "../api-types"

export function createDesktopNotify(api: ElectronAPI): Platform["notify"] {
  return async (title, description, onClick) => {
    const focused = await api.getWindowFocused().catch(() => document.hasFocus())
    console.log("[notify] renderer", JSON.stringify({ title, focused }))
    if (focused) return

    // Raised in the main process so the branded icon travels inside the toast. A renderer
    // Notification makes Windows resolve the app icon from the Start Menu entry instead, which
    // an unpackaged dev run has none of, so it falls back to the Electron icon.
    await api.notify(title, description)
    onClick?.()
  }
}

import { app, shell } from "electron"
import { existsSync } from "node:fs"
import path from "node:path"
import { APP_ID, APP_NAME } from "../constants"

// Windows attributes a toast to the Start Menu entry registered for the app's AppUserModelID.
// A packaged build gets that entry from the installer, but an unpackaged dev run has none, so
// Windows falls back to the executable name and labels every notification "Electron" with the
// Electron icon. Registering a dev-only shortcut under the same AUMID gives the real name and icon.
export function notificationIconPath() {
  if (app.isPackaged) return path.join(process.resourcesPath, "icons", "icon.png")
  return path.join(app.getAppPath(), "resources", "icons", "icon.png")
}

export function registerDevNotificationIdentity() {
  if (app.isPackaged) return
  const startMenu = app.getPath("appData")
  if (!startMenu) return
  // Windows reads the toast app icon from the shell link, and only reliably honours an .ico there;
  // a .png link icon silently falls back to the executable's icon.
  const icons = path.join(app.getAppPath(), "resources", "icons")
  const icon = [path.join(icons, "icon.ico"), path.join(icons, "icon.png")].find((file) => existsSync(file))
  try {
    shell.writeShortcutLink(path.join(startMenu, "Microsoft", "Windows", "Start Menu", `${APP_NAME}.lnk`), {
      target: process.execPath,
      appUserModelId: APP_ID,
      description: APP_NAME,
      ...(icon ? { icon } : {}),
    })
  } catch {}
}

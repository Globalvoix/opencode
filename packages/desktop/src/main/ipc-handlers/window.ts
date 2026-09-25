import { BrowserWindow, Notification, nativeImage } from "electron"
import { Effect } from "effect"
import { WindowRpcs } from "../../shared/ipc-rpc"
import { IpcPortHandoff } from "../ipc-transport"
import { getPinchZoomEnabled, setPinchZoomEnabled, setTitlebar, setWindowThemeReady, updateTitlebar } from "../windows"
import { notificationIconPath } from "../lifecycle/notification-identity"
import { sender } from "./context"

export const windowHandlers = WindowRpcs.toLayer(
  Effect.gen(function* () {
    const handoff = yield* IpcPortHandoff
    return WindowRpcs.of({
      WindowThemeReady: (_args, context) =>
        Effect.sync(() => {
          const win = BrowserWindow.fromWebContents(sender(handoff, context))
          if (!win) throw new Error("Window not found")
          setWindowThemeReady(win)
        }),
      WindowGetFocused: (_args, context) =>
        Effect.sync(() => BrowserWindow.fromWebContents(sender(handoff, context))?.isFocused() ?? false),
      WindowGetFullscreen: (_args, context) =>
        Effect.sync(() => BrowserWindow.fromWebContents(sender(handoff, context))?.isFullScreen() ?? false),
      WindowSetFocus: (_args, context) =>
        Effect.sync(() => BrowserWindow.fromWebContents(sender(handoff, context))?.focus()),
      WindowShow: (_args, context) =>
        Effect.sync(() => BrowserWindow.fromWebContents(sender(handoff, context))?.show()),
      WindowGetZoomFactor: (_args, context) => Effect.sync(() => sender(handoff, context).getZoomFactor()),
      WindowSetZoomFactor: ({ factor }, context) =>
        Effect.sync(() => {
          const contents = sender(handoff, context)
          contents.setZoomFactor(factor)
          const win = BrowserWindow.fromWebContents(contents)
          if (win) updateTitlebar(win)
        }),
      WindowGetPinchZoomEnabled: () => Effect.sync(getPinchZoomEnabled),
      WindowSetPinchZoomEnabled: ({ enabled }) => Effect.sync(() => setPinchZoomEnabled(enabled)),
      WindowSetTitlebar: ({ theme }, context) =>
        Effect.sync(() => {
          const win = BrowserWindow.fromWebContents(sender(handoff, context))
          if (win) setTitlebar(win, theme)
        }),
      // Raised from the main process so the icon is embedded in the toast itself. A renderer
      // Notification makes Windows resolve the app icon through the Start Menu AppUserModelID,
      // which an unpackaged dev run has no installed entry for, so it falls back to Electron's.
      WindowNotify: ({ title, body }, context) =>
        Effect.sync(() => {
          const icon = notificationIconPath()
          console.log("[notify] raise", JSON.stringify({ title, body, icon, supported: Notification.isSupported() }))
          if (!Notification.isSupported()) return
          new Notification({
            title,
            body: body ?? "",
            silent: true,
            ...(icon ? { icon: nativeImage.createFromPath(icon).resize({ width: 96, height: 96 }) } : {}),
          }).on("click", () => {
            const win = BrowserWindow.fromWebContents(sender(handoff, context))
            win?.show()
            win?.focus()
          })
        }),
    })
  }),
)

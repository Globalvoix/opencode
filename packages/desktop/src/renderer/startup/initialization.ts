import type { ElectronAPI } from "../api-types"

type SidecarData = Awaited<ReturnType<ElectronAPI["awaitInitialization"]>>

export function initializationData<A>(state: (() => A | undefined) & { error: unknown }) {
  if (state.error !== undefined) throw markLocalServerStartup(state.error)
  return state()
}

/**
 * Bounds a startup wait that otherwise never settles. The splash overlay only
 * dismisses once every startup resource resolves, so a hung backend promise
 * would spin the loading animation forever; timing out surfaces the error
 * page (with its restart action) instead.
 */
export function withStartupTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(markLocalServerStartup(new Error(`${label} timed out after ${ms} ms`))), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

// The main process adds Authorization to sidecar requests (`wireRendererHeaders`); the renderer never
// holds the password, and its GETs carry only CORS-safelisted headers so they skip the preflight.
export function sidecarHttp(data: SidecarData) {
  return { url: data.url }
}

export function createSidecarResolver(input: {
  api: Pick<ElectronAPI, "reconnectService">
  current: () => SidecarData | undefined
  update: (data: SidecarData) => void
}) {
  return async (signal: AbortSignal) => {
    if (signal.aborted) throw signal.reason
    const next = await input.api.reconnectService()
    if (signal.aborted) throw signal.reason
    if (!sameSidecar(input.current(), next)) input.update(next)
    return sidecarHttp(next)
  }
}

function sameSidecar(current: SidecarData | undefined, next: SidecarData) {
  return current?.url === next.url
}

function markLocalServerStartup(error: unknown) {
  const failure = error instanceof Error ? error : new Error(String(error))
  Object.defineProperty(failure, "localServerStartup", { value: true })
  return failure
}

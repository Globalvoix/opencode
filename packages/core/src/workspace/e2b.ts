import { Sandbox } from "e2b"
import { Effect, Predicate } from "effect"
import type { Workspace } from "@opencode/schema/workspace"
import type { EnvironmentDriver } from "../environment/driver.js"
import { makeE2BSpawner } from "../environment/e2b.js"
import type { WorkspaceDriver } from "./driver.js"
import { Error } from "./error.js"

/**
 * E2B-backed workspace provider. One E2B sandbox per workspace: the agent's
 * processes and files all live inside it, and nothing touches the host disk.
 *
 * The E2B API key comes from `E2B_API_KEY` and is never stored anywhere else.
 * Every sandbox is tagged with the workspace ID so create stays idempotent
 * across retries and crashes, and interrupted provisioning can be swept.
 */

export const provider = "e2b"

const METADATA_KEY = "thinksoft.workspace.id"

/**
 * The agent's working directory inside every sandbox. Ensured to exist at
 * provision time so it is always a valid spawn cwd and listing root.
 */
export const SANDBOX_DIRECTORY = "/home/user/app"

export const SANDBOX_TIMEOUT_MS = 3_600_000

export function sandboxIdFromBinding(binding: WorkspaceDriver.Binding): string | undefined {
  const value = binding["sandboxId"]
  return typeof value === "string" ? value : undefined
}

const requireApiKey = Effect.fn("E2BWorkspace.apiKey")(function* () {
  const key = process.env.E2B_API_KEY
  if (!key) return yield* new Error({ message: "E2B_API_KEY is not set" })
  return key
})

const driverError = (method: string, cause: unknown) =>
  new Error({
    message: Predicate.isError(cause) ? `${method}: ${cause.message}` : `${method}: ${String(cause)}`,
  })

const listSandboxIds = Effect.fn("E2BWorkspace.listSandboxIds")(function* (apiKey: string, workspaceID: string) {
  const paginator = yield* Effect.try({
    try: () => Sandbox.list({ apiKey, query: { metadata: { [METADATA_KEY]: workspaceID } } }),
    catch: (cause) => driverError("list", cause),
  })
  const ids: Array<string> = []
  while (paginator.hasNext) {
    const items = yield* Effect.tryPromise({
      try: () => paginator.nextItems(),
      catch: (cause) => driverError("list", cause),
    })
    for (const item of items) ids.push(item.sandboxId)
  }
  return ids
})

const killSandbox = Effect.fn("E2BWorkspace.killSandbox")(function* (apiKey: string, sandboxId: string) {
  yield* Effect.tryPromise({
    try: () => Sandbox.kill(sandboxId, { apiKey }),
    catch: (cause) => cause,
  }).pipe(
    Effect.catchIf(
      (cause): cause is { readonly message: string } =>
        Predicate.isError(cause) && /not.?found/i.test(cause.message),
      () => Effect.void,
    ),
    Effect.mapError((cause) => driverError("kill", cause)),
  )
})

const connectSandbox = Effect.fn("E2BWorkspace.connectSandbox")(function* (apiKey: string, sandboxId: string) {
  return yield* Effect.tryPromise({
    try: () => Sandbox.connect(sandboxId, { apiKey }),
    catch: (cause) => driverError("connect", cause),
  })
})

export const driver: WorkspaceDriver.Interface = {
  create: Effect.fn("E2BWorkspace.create")(function* ({ workspaceID }: { readonly workspaceID: Workspace.ID }) {
    const apiKey = yield* requireApiKey()
    const id = workspaceID.toString()
    const adopted = yield* listSandboxIds(apiKey, id)
    if (adopted[0] !== undefined) return { binding: { sandboxId: adopted[0] } }
    const sandbox = yield* Effect.tryPromise({
      try: () =>
        Sandbox.create({
          apiKey,
          metadata: { [METADATA_KEY]: id },
          timeoutMs: SANDBOX_TIMEOUT_MS,
        }),
      catch: (cause) => driverError("create", cause),
    })
    yield* Effect.tryPromise({
      try: () => sandbox.files.makeDir(SANDBOX_DIRECTORY),
      catch: (cause) => driverError("create", cause),
    })
    return { binding: { sandboxId: sandbox.sandboxId } }
  }),

  connect: Effect.fn("E2BWorkspace.connect")(function* ({
    binding,
  }: {
    readonly workspaceID: Workspace.ID
    readonly binding: WorkspaceDriver.Binding
    readonly saveBinding: (binding: WorkspaceDriver.Binding) => Effect.Effect<void>
  }) {
    const apiKey = yield* requireApiKey()
    const sandboxId = sandboxIdFromBinding(binding)
    if (!sandboxId) return yield* new Error({ message: "E2B binding has no sandboxId" })
    const sandbox = yield* connectSandbox(apiKey, sandboxId)
    const environment: EnvironmentDriver.Driver = { spawner: makeE2BSpawner(sandbox) }
    return environment
  }),

  suspendForIdle: Effect.fn("E2BWorkspace.suspendForIdle")(function* ({
    binding,
  }: {
    readonly workspaceID: Workspace.ID
    readonly binding: WorkspaceDriver.Binding
    readonly saveBinding: (binding: WorkspaceDriver.Binding) => Effect.Effect<void>
  }) {
    const apiKey = yield* requireApiKey()
    const sandboxId = sandboxIdFromBinding(binding)
    if (!sandboxId) return yield* new Error({ message: "E2B binding has no sandboxId" })
    const sandbox = yield* connectSandbox(apiKey, sandboxId)
    yield* Effect.tryPromise({
      try: () => sandbox.pause(),
      catch: (cause) => driverError("suspend", cause),
    })
  }),

  destroy: Effect.fn("E2BWorkspace.destroy")(function* ({
    workspaceID,
    binding,
  }: {
    readonly workspaceID: Workspace.ID
    readonly binding: WorkspaceDriver.Binding | null
  }) {
    const apiKey = yield* requireApiKey()
    const sandboxId = binding ? sandboxIdFromBinding(binding) : undefined
    if (sandboxId) {
      yield* killSandbox(apiKey, sandboxId)
      return
    }
    const swept = yield* listSandboxIds(apiKey, workspaceID.toString())
    yield* Effect.forEach(swept, (id) => killSandbox(apiKey, id), { discard: true })
  }),
}

export * as E2BWorkspace from "./e2b.js"

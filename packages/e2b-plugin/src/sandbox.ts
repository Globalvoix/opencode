import { Sandbox } from "e2b"

export const SANDBOX_DIRECTORY = "/home/user/app"
export const SANDBOX_TIMEOUT_MS = 3_600_000
export const SESSION_METADATA_KEY = "thinksoft.session.id"
const STORAGE_PREFIX = "e2b.sandbox."

export interface ExecResult {
  readonly stdout: string
  readonly stderr: string
  readonly exitCode: number
}

export interface SandboxClient {
  readonly sandboxId: string
  exec(command: string, cwd?: string): Promise<ExecResult>
  read(path: string): Promise<Uint8Array>
  write(path: string, content: Uint8Array): Promise<void>
  list(path: string): Promise<Array<{ name: string; type: string }>>
  touch(): Promise<void>
  kill(): Promise<void>
}

export interface SandboxFactory {
  create(metadata: Record<string, string>): Promise<SandboxClient>
  connect(sandboxId: string): Promise<SandboxClient>
  kill(sandboxId: string): Promise<void>
}

export interface SandboxStorage {
  get(key: string): Promise<unknown>
  set(key: string, value: string): Promise<void>
  remove(key: string): Promise<void>
}

const toAbsolute = (path: string) => (path.startsWith("/") ? path : `${SANDBOX_DIRECTORY}/${path}`)

const e2bClient = (sandbox: Sandbox): SandboxClient => ({
  sandboxId: sandbox.sandboxId,
  async exec(command, cwd) {
    const result = await sandbox.commands.run(command, {
      cwd: cwd ?? SANDBOX_DIRECTORY,
      timeoutMs: 300_000,
    })
    return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode }
  },
  async read(path) {
    return sandbox.files.read(toAbsolute(path), { format: "bytes" })
  },
  async write(path, content) {
    await sandbox.files.write(toAbsolute(path), new Blob([content as BlobPart]))
  },
  async list(path) {
    const entries = await sandbox.files.list(toAbsolute(path))
    return entries.map((entry) => ({ name: entry.name, type: entry.type ?? "unknown" }))
  },
  async touch() {
    await sandbox.setTimeout(SANDBOX_TIMEOUT_MS)
  },
  async kill() {
    await sandbox.kill()
  },
})

export const e2bFactory = (apiKey?: string): SandboxFactory => {
  const key = () => {
    const resolved = apiKey ?? process.env.E2B_API_KEY
    if (!resolved) throw new Error("E2B_API_KEY is not set")
    return resolved
  }
  return {
    async create(metadata) {
      const sandbox = await Sandbox.create({ apiKey: key(), metadata, timeoutMs: SANDBOX_TIMEOUT_MS })
      await sandbox.files.makeDir(SANDBOX_DIRECTORY)
      return e2bClient(sandbox)
    },
    async connect(sandboxId) {
      return e2bClient(await Sandbox.connect(sandboxId, { apiKey: key() }))
    },
    async kill(sandboxId) {
      await Sandbox.kill(sandboxId, { apiKey: key() })
    },
  }
}

export function createSandboxManager(factory: SandboxFactory, storage?: SandboxStorage) {
  const live = new Map<string, SandboxClient>()
  const key = (sessionID: string) => `${STORAGE_PREFIX}${sessionID}`

  const ensure = async (sessionID: string): Promise<SandboxClient> => {
    const current = live.get(sessionID)
    if (current) {
      await current.touch().catch(() => undefined)
      return current
    }
    const stored = await storage?.get(key(sessionID)).catch(() => undefined)
    if (typeof stored === "string" && stored) {
      try {
        const client = await factory.connect(stored)
        live.set(sessionID, client)
        return client
      } catch {
        await storage?.remove(key(sessionID)).catch(() => undefined)
      }
    }
    const client = await factory.create({ [SESSION_METADATA_KEY]: sessionID })
    live.set(sessionID, client)
    await storage?.set(key(sessionID), client.sandboxId).catch(() => undefined)
    return client
  }

  const release = async (sessionID: string): Promise<void> => {
    const client = live.get(sessionID)
    live.delete(sessionID)
    await storage?.remove(key(sessionID)).catch(() => undefined)
    if (!client) return
    await client.kill().catch(() => undefined)
  }

  return { ensure, release }
}

export type SandboxManager = ReturnType<typeof createSandboxManager>

import { describe, expect, test } from "bun:test"
import plugin from "../index.js"
import { createSandboxManager, SANDBOX_DIRECTORY } from "./sandbox.js"
import { e2bTools } from "./tools.js"

const files = new Map<string, Uint8Array>()
const encoder = new TextEncoder()
const decoder = new TextDecoder()

const fakeFactory = (log: Array<string>) => ({
  async create() {
    log.push("create")
    return {
      sandboxId: "sbx_test",
      exec: async (command: string) => {
        log.push(`exec:${command}`)
        return { stdout: `out:${command}`, stderr: "", exitCode: 0 }
      },
      read: async (path: string) => {
        const bytes = files.get(path)
        if (!bytes) throw new Error(`not found: ${path}`)
        return bytes
      },
      write: async (path: string, content: Uint8Array) => {
        files.set(path, content)
      },
      list: async () => [{ name: "app.ts", type: "file" }],
      touch: async () => undefined,
      kill: async () => {
        log.push("kill")
      },
    }
  },
  async connect(sandboxId: string) {
    log.push(`connect:${sandboxId}`)
    const client = await fakeFactory(log).create()
    return { ...client, sandboxId }
  },
  async kill(sandboxId: string) {
    log.push(`kill:${sandboxId}`)
  },
})

const stored = new Map<string, string>()
const storage = {
  get: async (key: string) => stored.get(key),
  set: async (key: string, value: string) => void stored.set(key, value),
  remove: async (key: string) => void stored.delete(key),
}

describe("plugin wiring", () => {
  test("registers e2b tools, steers context and releases on delete", async () => {
    const added: Array<{ name: string }> = []
    let hook: ((input: { system: Array<{ type: string; text: string }>; tools: Record<string, unknown> }) => void | Promise<void>) | undefined
    const context = {
      tool: {
        transform: async (callback: (editor: { add: (tool: { name: string }) => void }) => void) => {
          callback({ add: (tool) => void added.push(tool) })
        },
      },
      session: {
        hook: async (_name: string, callback: typeof hook) => {
          hook = callback
        },
      },
      event: {
        subscribe: async function* () {
          yield { type: "session.deleted", data: { sessionID: "ses_1" } }
        },
      },
      storage,
    }
    type StubContext = typeof context
    const cleanup = await (
      plugin as unknown as { setup: (context: StubContext) => Promise<() => Promise<void>> }
    ).setup(context)
    expect(added.map((tool) => tool.name)).toEqual(["e2b_exec", "e2b_read", "e2b_write", "e2b_list", "e2b_edit"])
    expect(hook).toBeDefined()
    const input: { system: Array<{ type: string; text: string }>; tools: Record<string, unknown> } = {
      system: [],
      tools: { shell: {}, read: {}, webfetch: {} },
    }
    await hook!(input)
    expect(Object.keys(input.tools)).toEqual(["webfetch"])
    expect(input.system[0]?.text ?? "").toContain(SANDBOX_DIRECTORY)
    await cleanup?.()
  })

  test("manager creates once per session and kills on release", async () => {
    const log: Array<string> = []
    const manager = createSandboxManager(fakeFactory(log), storage)
    const first = await manager.ensure("ses_9")
    const second = await manager.ensure("ses_9")
    expect(first.sandboxId).toBe(second.sandboxId)
    expect(log.filter((entry) => entry === "create")).toHaveLength(1)
    await manager.release("ses_9")
    expect(log).toContain("kill")
  })

  test("tools read, write, list and edit through the sandbox", async () => {
    const log: Array<string> = []
    const manager = createSandboxManager(fakeFactory(log))
    const tools = Object.fromEntries(e2bTools(manager).map((tool) => [tool.name, tool]))
    const context = { sessionID: "ses_9", signal: new AbortController().signal, progress: async () => undefined }
    // @ts-expect-error stub context
    await tools.e2b_write.execute({ path: "hello.txt", content: "hello brave" }, context)
    // @ts-expect-error stub context
    const read = await tools.e2b_read.execute({ path: "hello.txt" }, context)
    expect(read.content).toBe("hello brave")
    // @ts-expect-error stub context
    const listed = await tools.e2b_list.execute({}, context)
    expect(listed.content).toContain("app.ts")
    // @ts-expect-error stub context
    const edited = await tools.e2b_edit.execute({ path: "hello.txt", oldText: "brave", newText: "sandbox" }, context)
    expect(edited.content).toBe("Edited hello.txt")
    // @ts-expect-error stub context
    await expect(tools.e2b_edit.execute({ path: "hello.txt", oldText: "missing", newText: "x" }, context)).rejects.toThrow(
      "not found",
    )
    // @ts-expect-error stub context
    const ran = await tools.e2b_exec.execute({ command: "echo hi" }, context)
    expect(String(ran.content)).toContain("exit code: 0")
  })
})

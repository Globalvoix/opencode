import { Schema } from "effect"
import type { Info, ToolContext } from "@opencode/plugin/promise/tool"
import type { SandboxManager } from "./sandbox.js"
import { SANDBOX_DIRECTORY } from "./sandbox.js"

const decoder = new TextDecoder()
const encoder = new TextEncoder()

const describePath = (path: string) =>
  `Absolute sandbox path, or relative to ${SANDBOX_DIRECTORY}. The sandbox filesystem is the only filesystem the agent may use.`

const sandboxOf = (manager: SandboxManager, context: ToolContext) => manager.ensure(context.sessionID)

const execInput = Schema.Struct({
  command: Schema.String.annotate({ description: "Shell command to run inside the sandbox." }),
  cwd: Schema.optionalKey(Schema.String).annotate({ description: "Working directory. Defaults to the sandbox project directory." }),
})

const readInput = Schema.Struct({
  path: Schema.String.annotate({ description: describePath("read") }),
})

const writeInput = Schema.Struct({
  path: Schema.String.annotate({ description: describePath("write") }),
  content: Schema.String.annotate({ description: "Full new file content. Parent directories are created." }),
})

const listInput = Schema.Struct({
  path: Schema.optionalKey(Schema.String).annotate({ description: "Directory to list. Defaults to the sandbox project directory." }),
})

const editInput = Schema.Struct({
  path: Schema.String.annotate({ description: describePath("edit") }),
  oldText: Schema.String.annotate({ description: "Exact existing text to replace. Must occur exactly once." }),
  newText: Schema.String.annotate({ description: "Replacement text." }),
})

export function e2bTools(manager: SandboxManager): Array<Info> {
  const exec: Info<typeof execInput> = {
    name: "e2b_exec",
    description: "Run a shell command inside the E2B sandbox. This is the ONLY way to execute commands; the host shell is off limits.",
    input: execInput,
    async execute(input, context) {
      const sandbox = await sandboxOf(manager, context)
      const result = await sandbox.exec(input.command, input.cwd)
      const output = [`exit code: ${result.exitCode}`, result.stdout, result.stderr].filter(Boolean).join("\n")
      return { content: output }
    },
  }
  const read: Info<typeof readInput> = {
    name: "e2b_read",
    description: "Read a file inside the E2B sandbox. This is the ONLY way to read files; host paths do not exist for you.",
    input: readInput,
    async execute(input, context) {
      const sandbox = await sandboxOf(manager, context)
      const bytes = await sandbox.read(input.path)
      return { content: decoder.decode(bytes) }
    },
  }
  const write: Info<typeof writeInput> = {
    name: "e2b_write",
    description: "Write a file inside the E2B sandbox, creating parent directories. This is the ONLY way to write files.",
    input: writeInput,
    async execute(input, context) {
      const sandbox = await sandboxOf(manager, context)
      await sandbox.write(input.path, encoder.encode(input.content))
      return { content: `Wrote ${input.content.length} characters to ${input.path}` }
    },
  }
  const list: Info<typeof listInput> = {
    name: "e2b_list",
    description: "List a directory inside the E2B sandbox. This is the ONLY way to browse files.",
    input: listInput,
    async execute(input, context) {
      const sandbox = await sandboxOf(manager, context)
      const entries = await sandbox.list(input.path ?? SANDBOX_DIRECTORY)
      return { content: entries.map((entry) => `${entry.type === "dir" ? "dir " : "file"} ${entry.name}`).join("\n") }
    },
  }
  const edit: Info<typeof editInput> = {
    name: "e2b_edit",
    description: "Replace exact text inside a sandbox file. Fails when the old text is missing or ambiguous.",
    input: editInput,
    async execute(input, context) {
      const sandbox = await sandboxOf(manager, context)
      const current = decoder.decode(await sandbox.read(input.path))
      const occurrences = current.split(input.oldText).length - 1
      if (occurrences === 0) throw new Error(`Text not found in ${input.path}`)
      if (occurrences > 1) throw new Error(`Text occurs ${occurrences} times in ${input.path}; be more specific`)
      await sandbox.write(input.path, encoder.encode(current.replace(input.oldText, input.newText)))
      return { content: `Edited ${input.path}` }
    },
  }
  return [exec, read, write, list, edit]
}

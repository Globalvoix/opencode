import { Plugin } from "@opencode/plugin"
import { createSandboxManager, e2bFactory } from "./sandbox.js"
import { SANDBOX_DIRECTORY } from "./sandbox.js"
import { e2bTools } from "./tools.js"

/**
 * Tools that touch the host disk. The agent works exclusively through the
 * e2b_* tools inside its sandbox; these names are deleted from every model
 * request context while the plugin is active.
 */
const LOCAL_FILE_TOOLS = ["shell", "edit", "write", "read", "glob", "grep", "patch"] as const

const STEERING = [
  "## E2B Sandbox",
  "Every session runs in its own isolated E2B sandbox. The sandbox project directory is /home/user/app.",
  "Use ONLY the e2b_exec, e2b_read, e2b_write, e2b_list and e2b_edit tools for commands and files.",
  "Host paths do not exist for you: never reference local directories, and never use any other file or shell tool.",
  "Run servers and long commands with shell backgrounding (trailing &) inside e2b_exec.",
].join("\n")

export default Plugin.define({
  id: "e2b-sandbox",
  setup: async (context: Plugin.Context) => {
    const manager = createSandboxManager(e2bFactory(), context.storage)
    await context.tool.transform((editor) => {
      for (const tool of e2bTools(manager)) editor.add(tool)
    })
    await context.session.hook("context", async (input) => {
      input.system.push({ type: "text", text: STEERING })
      for (const name of LOCAL_FILE_TOOLS) delete input.tools[name]
    })
    const controller = new AbortController()
    const loop = (async () => {
      for await (const event of context.event.subscribe({ signal: controller.signal })) {
        if (event.type === "session.deleted") {
          await manager.release(event.data.sessionID).catch(() => undefined)
        }
      }
    })()
    return () => {
      controller.abort()
      return loop.catch(() => undefined).then(() => undefined)
    }
  },
})

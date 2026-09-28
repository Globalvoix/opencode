#!/usr/bin/env bun
import { $ } from "bun"
import { Script } from "@opencode/script"

import { copyBuiltCliToResources, downloadCliToResources, resolveChannel, writeCliServiceFile } from "./utils"

const channel = resolveChannel()
if (channel === "prod" && !Bun.env.OPENCODE_CLI_DIST) {
  throw new Error("OPENCODE_CLI_DIST is required for production desktop builds")
}

await $`bun ./scripts/copy-icons.ts ${channel}`
await $`bun ./scripts/copy-metainfo.ts ${channel}`

// Record the staged CLI's registration filename next to the binary. Downloaded
// CLIs are upstream dev/beta/latest builds, which all use service.json; a CLI
// built from this repo uses Script.channel, so the desktop build must run in
// the same environment as the CLI build (same branch, same OPENCODE_CHANNEL).
if (channel === "dev") {
  await downloadCliToResources()
  await writeCliServiceFile("dev")
}
if ((channel === "beta" || channel === "prod") && Bun.env.OPENCODE_CLI_DIST) {
  await copyBuiltCliToResources(Bun.env.OPENCODE_CLI_DIST)
  await writeCliServiceFile(Script.channel)
}
if (channel === "beta" && !Bun.env.OPENCODE_CLI_DIST) {
  await downloadCliToResources("beta")
  await writeCliServiceFile("beta")
}

import { readFileSync } from "node:fs"
import path from "node:path"
import { app } from "electron"

// The backend's home directory and registration file. The desktop spawns its
// backend with XDG_*_HOME pointed here, so the child writes its registration
// into backendHome/opencode/<cli filename> — the desktop must watch exactly
// that file. Watching any other path (the shared default, or a different name)
// means the backend boots invisibly and startup times out.
//
// The filename part travels with the staged CLI (resources/opencode-cli.service,
// written by scripts/prebuild.ts) because it derives from the CLI's baked
// channel. It falls back to the channel-agnostic default for builds that
// predate the file.
export function backendHome() {
  return path.join(app.getPath("userData"), "backend")
}

export function backendServiceFile() {
  return path.join(backendHome(), "opencode", bundledServiceFilename())
}

function bundledServiceFilename() {
  const directory = app.isPackaged ? process.resourcesPath : path.join(app.getAppPath(), "resources")
  try {
    const name = readFileSync(path.join(directory, "opencode-cli.service"), "utf8").trim()
    if (name && !name.includes("/") && !name.includes("\\") && !name.includes("..")) return name
  } catch {}
  return "service.json"
}

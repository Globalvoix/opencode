import { describe, expect, test } from "bun:test"
import { ChildProcess } from "effect/unstable/process"
import { quoteArg, standardToShell, stdinOpen } from "./e2b.js"

describe("quoteArg", () => {
  test("quotes plain arguments", () => {
    expect(quoteArg("status")).toBe("'status'")
  })

  test("quotes arguments with spaces", () => {
    expect(quoteArg("my file.txt")).toBe("'my file.txt'")
  })

  test("escapes embedded single quotes", () => {
    expect(quoteArg("it's")).toBe("'it'\\''s'")
  })

  test("quotes shell metacharacters instead of interpreting them", () => {
    expect(quoteArg("a;rm -rf /")).toBe("'a;rm -rf /'")
  })

  test("quotes empty strings", () => {
    expect(quoteArg("")).toBe("''")
  })
})

describe("standardToShell", () => {
  test("quotes every argv part", () => {
    const rendered = standardToShell(ChildProcess.make("git", ["status", "--porcelain"], { cwd: "/home/user" }))
    expect(rendered.shell).toBe("'git' 'status' '--porcelain'")
    expect(rendered.cwd).toBe("/home/user")
    expect(rendered.envs).toBeUndefined()
  })

  test("passes shell source through unquoted", () => {
    const rendered = standardToShell(ChildProcess.make("echo", ["hi"], { shell: true }))
    expect(rendered.shell).toBe("echo hi")
  })

  test("drops undefined env values and empty env records", () => {
    const rendered = standardToShell(ChildProcess.make("env", [], { env: { A: "1", B: undefined } }))
    expect(rendered.envs).toEqual({ A: "1" })
    const empty = standardToShell(ChildProcess.make("env", [], { env: { B: undefined } }))
    expect(empty.envs).toBeUndefined()
  })
})

describe("stdinOpen", () => {
  test("closed for absent, ignore and inherit", () => {
    expect(stdinOpen(undefined)).toBe(false)
    expect(stdinOpen("ignore")).toBe(false)
    expect(stdinOpen("inherit")).toBe(false)
  })

  test("open for pipe and overlapped", () => {
    expect(stdinOpen("pipe")).toBe(true)
    expect(stdinOpen("overlapped")).toBe(true)
  })
})

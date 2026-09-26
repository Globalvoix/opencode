import { describe, expect, test } from "bun:test"
import { sandboxIdFromBinding } from "./e2b.js"

describe("sandboxIdFromBinding", () => {
  test("reads the sandbox id", () => {
    expect(sandboxIdFromBinding({ sandboxId: "sbx_123" })).toBe("sbx_123")
  })

  test("rejects missing and non-string ids", () => {
    expect(sandboxIdFromBinding({})).toBeUndefined()
    expect(sandboxIdFromBinding({ sandboxId: 42 })).toBeUndefined()
  })
})

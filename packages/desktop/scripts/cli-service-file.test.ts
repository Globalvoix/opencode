import { describe, expect, test } from "bun:test"
import { cliServiceFilename } from "./utils"

describe("bundled CLI service filename", () => {
  test("maps release channels to the shared name", () => {
    for (const channel of ["latest", "dev", "beta", "next"]) {
      expect(cliServiceFilename(channel)).toBe("service.json")
    }
  })

  test("maps local to its own name", () => {
    expect(cliServiceFilename("local")).toBe("service-local.json")
  })

  test("maps preview branches to hashed names", () => {
    expect(cliServiceFilename("thinksoft-build")).toBe("service-thinksoft-build.json")
  })

  test("sanitizes unsafe characters", () => {
    expect(cliServiceFilename("feat/thing")).toBe("service-feat-thing.json")
  })
})

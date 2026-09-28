import { describe, expect, test } from "bun:test"
import { consoleReturnWindow } from "./deep-link"

describe("Console return deep links", () => {
  test("reads the originating Desktop window", () => {
    expect(consoleReturnWindow("thinksoft://console/authorized?window=window-a")).toBe("window-a")
    expect(consoleReturnWindow("thinksoft://console/authorized?window=window%20b")).toBe("window b")
  })

  test("accepts links from older installs", () => {
    expect(consoleReturnWindow("opencode://console/authorized?window=window-a")).toBe("window-a")
  })

  test("rejects unrelated and malformed links", () => {
    expect(consoleReturnWindow("opencode://console/other?window=window-a")).toBeUndefined()
    expect(consoleReturnWindow("opencode://other/authorized?window=window-a")).toBeUndefined()
    expect(consoleReturnWindow("https://console/authorized?window=window-a")).toBeUndefined()
    expect(consoleReturnWindow("not a url")).toBeUndefined()
    expect(consoleReturnWindow("opencode://console/authorized")).toBeUndefined()
  })
})

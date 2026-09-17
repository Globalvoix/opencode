import { describe, expect, test } from "bun:test"
import {
  AUTH_SESSION_TTL,
  createAuthSession,
  frontendApiDomain,
  parseAuthSession,
} from "./auth-session"

const NOW = 1_700_000_000_000

describe("parseAuthSession", () => {
  test("accepts a valid unexpired session", () => {
    expect(
      parseAuthSession({ userId: "user_1", email: "a@b.c", expiresAt: NOW + 1000 }, NOW),
    ).toEqual({ userId: "user_1", email: "a@b.c", expiresAt: NOW + 1000 })
  })

  test("rejects expired sessions", () => {
    expect(parseAuthSession({ userId: "user_1", email: "a@b.c", expiresAt: NOW }, NOW)).toBeNull()
    expect(parseAuthSession({ userId: "user_1", email: "a@b.c", expiresAt: NOW - 1 }, NOW)).toBeNull()
  })

  test("rejects malformed values", () => {
    expect(parseAuthSession(null, NOW)).toBeNull()
    expect(parseAuthSession([], NOW)).toBeNull()
    expect(parseAuthSession({ userId: "", email: "a@b.c", expiresAt: NOW + 1 }, NOW)).toBeNull()
    expect(parseAuthSession({ userId: "user_1", email: "", expiresAt: NOW + 1 }, NOW)).toBeNull()
    expect(parseAuthSession({ userId: "user_1", email: "a@b.c" }, NOW)).toBeNull()
  })
})

describe("createAuthSession", () => {
  test("stamps a 30-day expiry", () => {
    expect(createAuthSession("user_1", "a@b.c", NOW)).toEqual({
      userId: "user_1",
      email: "a@b.c",
      expiresAt: NOW + AUTH_SESSION_TTL,
    })
  })

  test("rejects empty identities", () => {
    expect(() => createAuthSession("", "a@b.c", NOW)).toThrow()
    expect(() => createAuthSession("user_1", "", NOW)).toThrow()
  })
})

describe("frontendApiDomain", () => {
  test("decodes the Clerk frontend API domain", () => {
    expect(frontendApiDomain("pk_test_dXNhYmxlLWxhZHliaXJkLTM1LmNsZXJrLmFjY291bnRzLmRldiQ")).toBe(
      "usable-ladybird-35.clerk.accounts.dev",
    )
  })

  test("returns empty for invalid keys", () => {
    expect(frontendApiDomain("")).toBe("")
    expect(frontendApiDomain("not-a-key")).toBe("")
  })
})

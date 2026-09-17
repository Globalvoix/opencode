import { getStore } from "./store"
import { createAuthSession, parseAuthSession, type AuthSession } from "./auth-session"

export type { AuthSession }

const STORE_NAME = "thinksoft.auth"
const SESSION_KEY = "session"

export function getAuthSession(now = Date.now()) {
  return parseAuthSession(getStore(STORE_NAME).get(SESSION_KEY), now)
}

export function setAuthSession(userId: string, email: string, now = Date.now()) {
  const session = createAuthSession(userId, email, now)
  getStore(STORE_NAME).set(SESSION_KEY, session)
  return session
}

export function clearAuthSession() {
  getStore(STORE_NAME).delete(SESSION_KEY)
}

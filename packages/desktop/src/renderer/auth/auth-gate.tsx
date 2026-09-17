import type { Clerk } from "@clerk/clerk-js"
import { createSignal, onCleanup, onMount, Show } from "solid-js"
import { t } from "../i18n"
import "./auth-gate.css"
import { clerkMessage, randomState, resolvePublishableKey, verifyClerkSessionToken } from "./clerk-token"

const POLL_INTERVAL = 1500
const POLL_TIMEOUT = 5 * 60 * 1000

type PendingVerification = { kind: "signin" | "signup"; email: string }

function isUnknownIdentifierError(cause: unknown) {
  if (typeof cause === "object" && cause !== null && "errors" in cause) {
    const errors = (cause as { errors?: { code?: unknown }[] }).errors
    if (errors?.some((entry) => entry.code === "form_identifier_not_found")) return true
  }
  const message = cause instanceof Error ? cause.message : String(cause)
  return /couldn.?t find|not found|no account/i.test(message)
}

function resolveColorMode(): "light" | "dark" {
  try {
    const saved = localStorage.getItem("opencode-color-scheme")
    if (saved === "light" || saved === "dark") return saved
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function googleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function ThinksoftAuthGate(props: { onAuthenticated: () => void }) {
  const [signUp, setSignUp] = createSignal(false)
  const [step, setStep] = createSignal<"form" | "code" | "browser">("form")
  const [email, setEmail] = createSignal("")
  const [code, setCode] = createSignal("")
  const [error, setError] = createSignal("")
  const [busy, setBusy] = createSignal(false)
  const [pending, setPending] = createSignal<PendingVerification | null>(null)

  const publishableKey = resolvePublishableKey()
  const [mode, setMode] = createSignal<"light" | "dark">(resolveColorMode())
  let clerk: Clerk | null = null
  let pollGen = 0
  onCleanup(() => {
    pollGen++
  })
  onMount(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const refresh = () => setMode(resolveColorMode())
    const onStorage = (event: StorageEvent) => {
      if (event.key === "opencode-color-scheme") refresh()
    }
    media.addEventListener("change", refresh)
    window.addEventListener("storage", onStorage)
    onCleanup(() => {
      media.removeEventListener("change", refresh)
      window.removeEventListener("storage", onStorage)
    })
  })

  async function loadClerk() {
    if (clerk) return clerk
    const { Clerk: ClerkClient } = await import("@clerk/clerk-js")
    clerk = new ClerkClient(publishableKey)
    await clerk.load()
    return clerk
  }

  function persistClerkUser(client: Clerk, fallbackEmail: string) {
    const user = client.user
    const userEmail =
      user?.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId)?.emailAddress ??
      user?.emailAddresses[0]?.emailAddress ??
      fallbackEmail
    return window.api.authSetSession(user?.id ?? "clerk-user", userEmail)
  }

  async function submitEmail(event: Event) {
    event.preventDefault()
    const address = email().trim()
    if (address === "" || busy()) return
    setBusy(true)
    setError("")
    try {
      const client = await loadClerk()
      setPending(await sendEmailCode(client, address))
      setCode("")
      setStep("code")
    } catch (cause) {
      setError(clerkMessage(cause, t("desktop.auth.error.code")))
    } finally {
      setBusy(false)
    }
  }

  async function sendEmailCode(client: Clerk, address: string): Promise<PendingVerification> {
    if (!signUp()) {
      try {
        const signIn = client.client.signIn
        await signIn.create({ identifier: address })
        const factor = (signIn.supportedFirstFactors ?? []).find(
          (entry): entry is { strategy: "email_code"; emailAddressId: string } =>
            entry.strategy === "email_code",
        )
        if (factor === undefined) throw new Error("Email code sign-in is not enabled for this account.")
        await signIn.prepareFirstFactor({ strategy: "email_code", emailAddressId: factor.emailAddressId })
        return { kind: "signin", email: address }
      } catch (cause) {
        if (!isUnknownIdentifierError(cause)) throw cause
      }
    }
    const signUpResource = client.client.signUp
    await signUpResource.create({ emailAddress: address })
    await signUpResource.prepareEmailAddressVerification({ strategy: "email_code" })
    return { kind: "signup", email: address }
  }

  async function submitCode(event: Event) {
    event.preventDefault()
    const current = pending()
    if (!current || busy()) return
    setBusy(true)
    setError("")
    try {
      const client = await loadClerk()
      if (current.kind === "signup") {
        const result = await client.client.signUp.attemptEmailAddressVerification({ code: code().trim() })
        if (result.status !== "complete" || !client.client.signUp.createdSessionId) {
          throw new Error("Verification is incomplete. Please try again.")
        }
        await client.setActive({ session: client.client.signUp.createdSessionId })
      } else {
        const result = await client.client.signIn.attemptFirstFactor({ strategy: "email_code", code: code().trim() })
        if (result.status !== "complete" || !client.client.signIn.createdSessionId) {
          throw new Error("Verification is incomplete. Please try again.")
        }
        await client.setActive({ session: client.client.signIn.createdSessionId })
      }
      await persistClerkUser(client, current.email)
      props.onAuthenticated()
    } catch (cause) {
      setError(clerkMessage(cause, t("desktop.auth.error.invalidCode")))
    } finally {
      setBusy(false)
    }
  }

  async function signInWithGoogle() {
    if (busy()) return
    setError("")
    const origin = await window.api.authGetLoopbackOrigin().catch(() => null)
    if (!origin) {
      setError(t("desktop.auth.error.loopback"))
      return
    }
    const state = randomState()
    try {
      await window.api.authOpenExternal(
        `${origin}/auth?state=${state}&key=${encodeURIComponent(publishableKey)}&theme=${mode()}`,
      )
    } catch {
      setError(t("desktop.auth.error.browser"))
      return
    }
    setStep("browser")
    const gen = ++pollGen
    const alive = () => pollGen === gen
    const deadline = Date.now() + POLL_TIMEOUT
    while (alive() && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
      if (!alive()) return
      let response: Response
      try {
        response = await fetch(`${origin}/oauth/status?state=${state}`)
      } catch {
        continue
      }
      if (!alive()) return
      if (response.status === 404) {
        setError(t("desktop.auth.error.expired"))
        setStep("form")
        return
      }
      if (!response.ok) continue
      const payload = (await response.json()) as { status?: string; token?: string; email?: string }
      if (payload.status !== "done" || typeof payload.token !== "string") continue
      try {
        const verified = await verifyClerkSessionToken(payload.token, publishableKey)
        const userEmail = typeof payload.email === "string" && payload.email !== "" ? payload.email : "google-user"
        await window.api.authSetSession(verified.userId, userEmail)
        props.onAuthenticated()
      } catch (cause) {
        setError(clerkMessage(cause, t("desktop.auth.error.verify")))
        setStep("form")
      }
      return
    }
    if (alive()) {
      setError(t("desktop.auth.error.timeout"))
      setStep("form")
    }
  }

  function backToForm() {
    pollGen++
    setPending(null)
    setError("")
    setStep("form")
  }

  return (
    <div class="thinksoft-auth-page" data-mode={mode()}>
      <div class="thinksoft-auth-column">
        <h1 class="thinksoft-auth-title">
          {signUp() ? t("desktop.auth.title.signUp") : t("desktop.auth.title.signIn")}
        </h1>
        <div class="thinksoft-auth-card">
          <Show when={step() === "form"}>
            <button
              type="button"
              disabled={busy()}
              onClick={() => void signInWithGoogle()}
              class="thinksoft-auth-button thinksoft-auth-button-secondary"
            >
              {googleIcon()}
              <span>{t("desktop.auth.google")}</span>
            </button>
            <div class="thinksoft-auth-divider">{t("desktop.auth.or")}</div>
            <form onSubmit={(event) => void submitEmail(event)} class="thinksoft-auth-form">
              <input
                type="email"
                required
                autocomplete="email"
                value={email()}
                onInput={(event) => setEmail(event.currentTarget.value)}
                placeholder={t("desktop.auth.email.placeholder")}
                class="thinksoft-auth-input"
              />
              <button type="submit" disabled={busy()} class="thinksoft-auth-button thinksoft-auth-button-primary">
                {t("desktop.auth.email.continue")}
              </button>
            </form>
            <p class="thinksoft-auth-error">{error()}</p>
          </Show>
          <Show when={step() === "code"}>
            <p class="thinksoft-auth-text">{t("desktop.auth.code.prompt", { email: pending()?.email ?? "" })}</p>
            <form onSubmit={(event) => void submitCode(event)} class="thinksoft-auth-form" style="margin-top: 16px">
              <input
                type="text"
                required
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength={12}
                value={code()}
                onInput={(event) => setCode(event.currentTarget.value)}
                placeholder={t("desktop.auth.code.placeholder")}
                class="thinksoft-auth-input thinksoft-auth-input-code"
              />
              <button type="submit" disabled={busy()} class="thinksoft-auth-button thinksoft-auth-button-primary">
                {t("desktop.auth.code.verify")}
              </button>
            </form>
            <button type="button" onClick={backToForm} class="thinksoft-auth-quiet-button">
              {t("desktop.auth.back")}
            </button>
            <p class="thinksoft-auth-error">{error()}</p>
          </Show>
          <Show when={step() === "browser"}>
            <div class="thinksoft-auth-spinner" />
            <p class="thinksoft-auth-text" style="margin-top: 20px">
              {t("desktop.auth.browser.text")}
            </p>
            <button type="button" onClick={backToForm} class="thinksoft-auth-quiet-button">
              {t("desktop.auth.browser.cancel")}
            </button>
            <p class="thinksoft-auth-error">{error()}</p>
          </Show>
        </div>
        <Show when={step() === "form"}>
          <button
            type="button"
            onClick={() => {
              setSignUp(!signUp())
              setError("")
            }}
            class="thinksoft-auth-switch"
          >
            {signUp() ? t("desktop.auth.switch.signIn") : t("desktop.auth.switch.signUp")}
          </button>
        </Show>
      </div>
    </div>
  )
}

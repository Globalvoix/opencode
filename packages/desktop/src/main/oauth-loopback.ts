import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http"
import { frontendApiDomain } from "./auth-session"
import { write as writeLog } from "./logging"

export const OAUTH_LOOPBACK_PORT = (() => {
  const raw = process.env.THINKSOFT_OAUTH_PORT
  if (!raw) return 43123
  const port = Number(raw)
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) return 43123
  return port
})()

type Handshake = {
  createdAt: number
  done: boolean
  key: string
  frontendApi: string
  theme: PageTheme
  token?: string
  email?: string
}

const handshakes = new Map<string, Handshake>()
const HANDSHAKE_TTL = 10 * 60 * 1000
const BODY_LIMIT = 16 * 1024
const STATE_PATTERN = /^[A-Za-z0-9_-]{16,128}$/

let server: Server | undefined

export function getOAuthLoopbackOrigin() {
  if (!server) return null
  return `http://127.0.0.1:${OAUTH_LOOPBACK_PORT}`
}

function sweepExpired(now = Date.now()) {
  for (const [state, handshake] of handshakes) {
    if (now - handshake.createdAt > HANDSHAKE_TTL) handshakes.delete(state)
  }
}

function latestPending() {
  let latest: string | undefined
  let latestAt = -1
  for (const [state, handshake] of handshakes) {
    if (!handshake.done && handshake.createdAt > latestAt) {
      latest = state
      latestAt = handshake.createdAt
    }
  }
  return latest
}

function escapeHtmlAttribute(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

type PageTheme = "light" | "dark"

function parsePageTheme(value: string | null): PageTheme {
  return value === "light" ? "light" : "dark"
}

function themeColors(theme: PageTheme) {
  if (theme === "light") {
    return {
      page: "#ffffff",
      ink: "#111111",
      card: "#ffffff",
      border: "#eaeaea",
      button: "#ffffff",
      buttonHover: "#f9f9f9",
      note: "#555555",
      divider: "#888888",
      spinnerTrack: "#eaeaea",
      error: "#b42318",
    }
  }
  return {
    page: "#0a0a0a",
    ink: "#fafafa",
    card: "#111111",
    border: "#262626",
    button: "#1a1a1a",
    buttonHover: "#242424",
    note: "#a3a3a3",
    divider: "#737373",
    spinnerTrack: "#333333",
    error: "#f87171",
  }
}

function authStartPage(state: string, publishableKey: string, frontendApi: string, theme: PageTheme) {
  const callbackUrl = `http://127.0.0.1:${OAUTH_LOOPBACK_PORT}/auth/callback?state=${encodeURIComponent(state)}`
  const c = themeColors(theme)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Thinksoft sign in</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:${c.page};color:${c.ink};font-family:Inter,ui-sans-serif,system-ui,sans-serif;padding:24px;box-sizing:border-box}
.wrap{width:100%;max-width:420px;display:flex;flex-direction:column;align-items:center}
h1{margin:0 0 40px;color:${c.ink};font-size:36px;font-weight:600;letter-spacing:-.02em}
.card{width:100%;box-sizing:border-box;border:1px solid ${c.border};border-radius:24px;background:${c.card};padding:32px}
button{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:40px;border:1px solid ${c.border};border-radius:8px;background:${c.button};color:${c.ink};font-size:14px;font-weight:500;cursor:pointer}
button:hover{background:${c.buttonHover}}
.divider{display:flex;align-items:center;justify-content:center;margin:24px 0;color:${c.divider};font-size:11px;font-weight:500;letter-spacing:.08em}
.note{margin:0;color:${c.note};font-size:14px;line-height:1.6;text-align:center}
.note strong{color:${c.ink};font-weight:500}
.spinner{width:28px;height:28px;margin:12px auto 20px;border:3px solid ${c.spinnerTrack};border-top-color:${c.ink};border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.error{color:${c.error};font-size:13px;line-height:1.5;min-height:18px;margin:14px 0 0;text-align:center}
[hidden]{display:none !important}
</style>
</head>
<body data-state="${escapeHtmlAttribute(state)}" data-callback="${escapeHtmlAttribute(callbackUrl)}">
<div class="wrap">
<h1>Sign In</h1>
<div class="card">
<div id="step-main">
<button id="google" type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg><span>Continue with Google</span></button>
<div class="divider"><span>OR</span></div>
<p class="note">Signing in with email? Enter it in the Thinksoft app instead.</p>
<p class="error" id="error"></p>
</div>
<div id="step-busy" hidden>
<div class="spinner"></div>
<p class="note" id="busy-text">Signing you in&hellip;</p>
<p class="error" id="busy-error"></p>
</div>
</div>
</div>
<script src="https://${escapeHtmlAttribute(frontendApi)}/npm/@clerk/clerk-js@6/dist/clerk.browser.js" data-clerk-publishable-key="${escapeHtmlAttribute(publishableKey)}" crossorigin="anonymous"><\/script>
<script>
(async () => {
  const state = document.body.dataset.state;
  const callback = document.body.dataset.callback;
  const main = document.getElementById('step-main');
  const busy = document.getElementById('step-busy');
  const busyText = document.getElementById('busy-text');
  const busyError = document.getElementById('busy-error');
  const error = document.getElementById('error');
  const google = document.getElementById('google');
  const showBusy = (text) => {
    main.hidden = true;
    busy.hidden = false;
    busyText.innerHTML = text;
    busyError.textContent = '';
  };
  const showMain = () => {
    busy.hidden = true;
    main.hidden = false;
  };
  const userEmail = () => {
    const user = Clerk.user || {};
    const list = user.emailAddresses || [];
    return ((list.find((entry) => entry.id === user.primaryEmailAddressId) || list[0] || {}).emailAddress) || '';
  };
  async function handBack() {
    const token = await Clerk.session.getToken();
    const response = await fetch('/oauth/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ state, token, email: userEmail() }),
    });
    if (!response.ok) throw new Error('The desktop app did not accept the sign-in. Is it still open?');
  }
  async function start() {
    error.textContent = '';
    if (typeof Clerk === 'undefined') {
      showMain();
      error.textContent = 'Could not reach the sign-in service. Check your connection and try again.';
      return;
    }
    try {
      await Clerk.load();
      if (Clerk.session) {
        showBusy('Signing you in&hellip;');
        await handBack();
        busyText.textContent = 'Signed in. Return to the Thinksoft app to continue.';
        return;
      }
      await Clerk.client.signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: callback,
        redirectUrlComplete: callback,
      });
    } catch (cause) {
      try {
        if (Clerk.session) {
          showBusy('Signing you in&hellip;');
          await handBack();
          busyText.textContent = 'Signed in. Return to the Thinksoft app to continue.';
          return;
        }
      } catch (inner) {
        showMain();
        busyError.textContent = (inner && inner.message) || 'Please try again.';
        return;
      }
      showMain();
      error.textContent = (cause && cause.message) || 'Please try again.';
    }
  }
  google.addEventListener('click', start);
  window.addEventListener('load', async () => {
    if (typeof Clerk === 'undefined') {
      showMain();
      error.textContent = 'Could not reach the sign-in service. Check your connection and try again.';
      return;
    }
    try {
      await Clerk.load();
      if (Clerk.session) {
        showBusy('Signing you in&hellip;');
        await handBack();
        busyText.textContent = 'Signed in. Return to the Thinksoft app to continue.';
      }
    } catch (cause) {
      showMain();
      error.textContent = (cause && cause.message) || 'Please try again.';
    }
  }, { once: true });
})();
<\/script>
</body>
</html>`
}

function authCallbackPage(publishableKey: string, frontendApi: string, theme: PageTheme) {
  const c = themeColors(theme)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Thinksoft sign in</title>
<script src="https://${escapeHtmlAttribute(frontendApi)}/npm/@clerk/clerk-js@6/dist/clerk.browser.js" data-clerk-publishable-key="${escapeHtmlAttribute(publishableKey)}" crossorigin="anonymous"><\/script>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:${c.page};color:${c.ink};font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.card{width:100%;max-width:420px;text-align:center;padding:24px}
h1{font-size:32px;font-weight:600;letter-spacing:-.02em;margin:0 0 12px}
p{color:${c.note};font-size:14px;line-height:1.6}
.error{color:${c.error}}
</style>
</head>
<body>
<div class="card">
<h1>Thinksoft</h1>
<p id="status">Finishing sign-in&hellip;</p>
</div>
<script>
(async () => {
  const status = document.getElementById('status');
  const fail = (message) => {
    status.textContent = message;
    status.className = 'error';
  };
  try {
    await Clerk.load();
    await Clerk.handleRedirectCallback();
    if (!Clerk.session) throw new Error('No session was created.');
    const token = await Clerk.session.getToken();
    const user = Clerk.user;
    const email = (user && user.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId) || user.emailAddresses[0] || {}).emailAddress || '';
    const state = new URLSearchParams(window.location.search).get('state') || '';
    const response = await fetch('/oauth/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ state, token, email }),
    });
    if (!response.ok) throw new Error('The desktop app did not accept the sign-in.');
    status.textContent = 'Signed in. Return to the Thinksoft app to continue.';
  } catch (cause) {
    fail((cause && cause.message) || 'Sign-in failed. Please close this tab and try again.');
  }
})();
<\/script>
</body>
</html>`
}

function readBody(request: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    request.on("data", (chunk: Buffer) => {
      size += chunk.byteLength
      if (size > BODY_LIMIT) {
        reject(new Error("request body too large"))
        request.destroy()
        return
      }
      chunks.push(chunk)
    })
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    request.on("error", reject)
  })
}

function json(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, {
    "content-type": "application/json",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  })
  response.end(JSON.stringify(body))
}

export function startOAuthLoopback() {
  if (server) return
  server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://127.0.0.1:${OAUTH_LOOPBACK_PORT}`)
    sweepExpired()
    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "content-type",
      })
      response.end()
      return
    }
    if (request.method === "GET" && url.pathname === "/auth") {
      const state = url.searchParams.get("state") ?? ""
      const key = url.searchParams.get("key") ?? ""
      const theme = parsePageTheme(url.searchParams.get("theme"))
      const frontendApi = frontendApiDomain(key)
      if (!STATE_PATTERN.test(state) || !key.startsWith("pk_") || frontendApi === "") {
        response.writeHead(400, { "content-type": "text/plain; charset=utf-8" })
        response.end("Invalid sign-in request. Restart sign-in from the Thinksoft app.")
        return
      }
      handshakes.set(state, { createdAt: Date.now(), done: false, key, frontendApi, theme })
      response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" })
      response.end(authStartPage(state, key, frontendApi, theme))
      return
    }
    if (request.method === "GET" && url.pathname === "/auth/callback") {
      const state = url.searchParams.get("state") ?? ""
      const handshake =
        (STATE_PATTERN.test(state) ? handshakes.get(state) : undefined) ??
        (latestPending() === undefined ? undefined : handshakes.get(latestPending() as string))
      if (handshake === undefined || handshake.done) {
        response.writeHead(400, { "content-type": "text/plain; charset=utf-8" })
        response.end("Sign-in session expired. Restart sign-in from the Thinksoft app.")
        return
      }
      response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" })
      response.end(authCallbackPage(handshake.key, handshake.frontendApi, handshake.theme))
      return
    }
    if (request.method === "POST" && url.pathname === "/oauth/complete") {
      void readBody(request).then((body) => {
        let payload: { state?: unknown; token?: unknown; email?: unknown }
        try {
          payload = JSON.parse(body) as typeof payload
        } catch {
          json(response, 400, { ok: false })
          return
        }
        const state =
          typeof payload.state === "string" && STATE_PATTERN.test(payload.state)
            ? payload.state
            : latestPending()
        const token = typeof payload.token === "string" ? payload.token : ""
        const email = typeof payload.email === "string" ? payload.email : ""
        const handshake = state === undefined ? undefined : handshakes.get(state)
        if (handshake === undefined || handshake.done || token.split(".").length !== 3) {
          json(response, 400, { ok: false })
          return
        }
        handshake.done = true
        handshake.token = token
        handshake.email = email
        json(response, 200, { ok: true })
      }).catch(() => json(response, 413, { ok: false }))
      return
    }
    if (request.method === "GET" && url.pathname === "/oauth/status") {
      const state = url.searchParams.get("state") ?? ""
      const handshake = handshakes.get(state)
      if (handshake === undefined) {
        json(response, 404, { status: "unknown" })
        return
      }
      if (handshake.done && handshake.token !== undefined) {
        handshakes.delete(state)
        json(response, 200, { status: "done", token: handshake.token, email: handshake.email ?? "" })
        return
      }
      json(response, 200, { status: "pending" })
      return
    }
    response.writeHead(404)
    response.end()
  })
  server.on("error", (error) =>
    writeLog(`oauth loopback server failed: ${error instanceof Error ? error.message : String(error)}`),
  )
  server.listen(OAUTH_LOOPBACK_PORT, "127.0.0.1")
  server.unref()
}

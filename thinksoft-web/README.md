# thinksoft-web

Marketing and download site for Thinksoft, the desktop AI software engineer. Static
Vite + React + Tailwind build, deployed to thinksoft.dev.

## Run locally

```sh
bun install
bun run dev      # http://localhost:4321
```

## Downloads

Every installer link lives in [`src/downloads.ts`](src/downloads.ts). The download
buttons in the hero open a dedicated download page that lists every build, grouped
by platform, and tags the one that matches the visitor's own OS and CPU:

| Platform | Builds |
| --- | --- |
| Windows | `x64` and `ARM64` (`.exe`) |
| macOS | Apple Silicon and Intel (`.dmg` and `.zip`) |
| Linux | `x86_64` and `ARM64` (`.AppImage`, `.deb`, `.rpm`) |

To publish a new version, update `DESKTOP_VERSION` in `src/downloads.ts` (or set
`VITE_DESKTOP_VERSION`) so the links point at the new release bucket.

To serve the installers from your own host instead of the default release bucket,
set `VITE_DOWNLOAD_BASE_URL` — the site then resolves every link against that
prefix:

```sh
VITE_DOWNLOAD_BASE_URL=https://thinksoft.dev/downloads/ bun run build
```

The site itself does not host installer files; the base URL must point at a
directory containing the release artifacts. The browser saves a download under the
name the server sends, so the served filenames decide what users see:

- Releases built from the current `packages/desktop/electron-builder.config.ts` are
  named `thinksoft-desktop-*`, so `VITE_ARTIFACT_PREFIX=thinksoft-desktop`.
- Already-published releases predate the rebrand and are named `opencode-desktop-*`,
  which is the default until a Thinksoft-named release exists at the base URL.

Both are set per build, for example:

```sh
VITE_DOWNLOAD_BASE_URL=https://thinksoft.dev/downloads/ \
VITE_ARTIFACT_PREFIX=thinksoft-desktop \
bun run build
```

If you host the files yourself, name them `thinksoft-desktop-*` (or any name you
like) and point the prefix at it — nothing else has to change.

### Renaming downloads

A browser saves a file under the name the server sends, so a release published
before the rebrand downloads as `opencode-desktop-win-x64.exe` no matter what the
page calls it. The `/downloads` route fixes that: it streams the installer from the
bucket and sets `Content-Disposition` to a Thinksoft name
(`Thinksoft-Setup-x64.exe`, `Thinksoft-Apple-Silicon.dmg`, and so on) without
buffering the file, so downloads stay fast and range requests still work.

It ships for both hosts:

| Host | File | Runtime |
| --- | --- | --- |
| Vercel | `api/downloads/[...path].ts` | Edge Function |
| Cloudflare Pages | `functions/downloads/[[path]].ts` | Pages Function |

Turn it on at build time:

```sh
VITE_DOWNLOAD_ROUTE=proxy bun run build
```

Set `DOWNLOAD_ORIGIN` and `DOWNLOAD_VERSION` as environment variables on the
deployment if the bucket is not `opencode.ai/files/bin/2.0.16`. The route only
proxies the twelve known artifacts; anything else returns 404, so it cannot be used
as an open relay.

## Check and build

```sh
bun run typecheck
bun run build      # static output in dist/
```

`dist/` is plain static output and can be served by any CDN or static host.

## Routing

The site is a single page with four views: the landing page, the download page, the
contact page and the applications page. They are reachable at `#download`,
`#contact` and `#apply` (what the buttons use), and at `/download`, `/contact` and
`/apply` when the host rewrites unknown paths to `index.html`. If your static host
does not rewrite, add a redirect or an `index.html` copy per route.

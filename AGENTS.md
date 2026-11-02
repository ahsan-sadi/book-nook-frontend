# AGENTS.md

Next.js 15 (App Router) front end for BookNook, plain JavaScript (no TS, `jsconfig.json` maps `@/*` to the repo root). The book/borrow data API is the **separate Express app in `../booknook-server`** — this repo only owns auth, UI, and the Next API route for BetterAuth.

## Commands

- `npm run dev` — dev server (defaults to port 3000; see auth gotcha below about 3001)
- `npm run build` — the only real verification step
- **No tests and no typecheck exist.** `npm run lint` (`next lint`) has no ESLint installed and no config, so it prompts interactively — don't rely on it
- **`npm run build` currently fails on a clean checkout**: `app/globals.css` loads daisyui via `@plugin`, but daisyui is not in `package.json`/`node_modules`. Run `npm i daisyui` first

## Architecture

- Pages in `app/**/page.jsx` are thin server components; interactive UI lives in `components/*View.jsx` (client components). New feature logic goes in the View, not the page
- Data fetching (`lib/api.js`):
  - `api(path, { auth: true })` — client-side calls to `NEXT_PUBLIC_API_URL` (the Express server) with a Bearer token
  - `publicBooks(query)` — server-side fetch of public data; **silently returns `[]` on any error**, so a broken API looks like an empty shelf, not a crash
- Auth: BetterAuth + MongoDB adapter. Server config in `lib/auth.js` (served by `app/api/auth/[...all]/route.js`), browser client in `lib/auth-client.js`. Route protection is `middleware.js`, which only checks for the session cookie against a **hardcoded matcher list** — new private pages must be added there
- UI stack is three systems mixed: Tailwind v4 (CSS-first config in `app/globals.css`, no `tailwind.config`), daisyUI classes (`btn`, `card`, `badge`...) with custom `booknook`/`booknook-dark` themes, and shadcn/ui components in `components/ui` (`components.json` has `tsx: false`, so `npx shadcn add <component>` generates `.jsx`)
- Book cover uploads go directly to imgbb from the browser (`lib/imgbb.js`); `next.config.mjs` allows all remote https images for this

## Verified gotchas (as of this writing)

- `components/Navbar.jsx` imports `signOut` from `lib/auth-client.js`, which doesn't export it — build emits an import warning
- `lib/auth-client.js` creates **two** clients: `authClient` with a hardcoded `baseURL: "http://localhost:3001"` (used only by `api.js` for tokens), and a second same-origin client that provides `signIn`/`signUp`/`useSession`. `.env` sets `BETTER_AUTH_URL=http://localhost:3001` while `npm run dev` serves 3000 — keep the port and URL consistent or token calls hit the wrong origin
- `api(path, { auth: true })` calls `authClient.token()`, which requires the BetterAuth JWT plugin registered on both sides (`jwt()` in `lib/auth.js`, `jwtClient()` in `lib/auth-client.js`). Neither is currently registered
- The UI signs in with `provider: "google"`, but `lib/auth.js` only configures BetterAuth's **github** social provider
- Dark mode is the daisyUI `data-theme` attribute on `<html>` (`booknook` / `booknook-dark`), persisted in `localStorage.theme` and applied pre-paint by an inline script in `app/layout.jsx`. Don't toggle the `.dark` class for daisyUI components
- `lib/mongodb.js` (reads `MONGODB_URI`/`DB_NAME`) is not imported anywhere; `lib/auth.js` opens its own client from `DB_URL`
- Env vars the code reads: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_IMGBB_KEY`, `DB_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (`MONGODB_URI`/`DB_NAME` only for the unused `lib/mongodb.js`). There is no `.env.example` here despite the README — the one in `../booknook-server` is a different app
- `D:\booknook\` (parent) has an empty `package.json` + its own lockfile, so Next warns it inferred the wrong workspace root during build. Harmless; silence with `outputFileTracingRoot` in `next.config.mjs` if it bothers you

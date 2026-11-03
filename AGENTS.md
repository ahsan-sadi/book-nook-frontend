# AGENTS.md

Next.js 15 (App Router) front end for BookNook, plain JavaScript (no TS, `jsconfig.json` maps `@/*` to the repo root).

## Commands

- `npm run dev` — dev server, **pinned to port 3000** (`-p 3000`)
- `npm run build` — the only real verification step
- **No tests and no typecheck exist.** `npm run lint` (`next lint`) has no ESLint config installed, so it prompts interactively — don't rely on it
- **Never run `npm run build` while `npm run dev` is running**: both use `.next`, and the build wipes dev's `server/vendor-chunks`, leaving the dev server serving 500s (`ENOENT ... vendor-chunks`). Stop dev, build, then restart dev (a stale `.next` can be deleted safely)

## Architecture

- **Data is local**: books/borrows come from `lib/store.js` (in-memory + `localStorage`, seeded by `lib/mock-data.js`, SSR-safe via `useSyncExternalStore`). `lib/api.js` is a shim with the old REST call shape (`api("/books?email=…", { auth: true })`) that routes into the store — there is **no Express dependency**. `../booknook-server` exists but is optional/decoupled.
- Pages in `app/**/page.jsx` are thin (often server) components; interactive UI lives in `components/*View.jsx` (client components).
- Auth is BetterAuth entirely inside this app: server config in `lib/auth.js` (served by `app/api/auth/[...all]/route.js`), browser client in `lib/auth-client.js` (single client, exports `signIn/signUp/signOut/useSession/authClient`). The `jwt()` / `jwtClient()` plugins serve `/api/auth/jwks` + `GET /token` for the optional Express API. Route protection is `middleware.js` (session-cookie check on a hardcoded matcher list) — new private pages must be added there.
- UI is **Tailwind v4 + shadcn/ui** (`components/ui/*.jsx`, base-ui primitives, `components.json` has `tsx: false`). daisyUI was removed; design tokens are `:root` / `.dark` vars in `app/globals.css` plus custom classes `.eyebrow`, `.display`, `.chip`, `.lift`, `.grain`, `.empty-state`, `.skeleton-paper`, `.container-page`.
- Book covers are resized to a JPEG data URL in the browser (`lib/covers.js`) — no upload service or API key.

## Env vars (client `.env`)

`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (= `http://localhost:3000`), `MONGODB_URI` (BetterAuth collections in the `booknook` DB), `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (empty ⇒ startup warning, Google sign-in disabled). There is no `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_IMGBB_KEY` anymore.

## Gotchas

- BetterAuth `minPasswordLength: 6` matches `RegisterForm`'s client validation; `autoSignIn: false` because the form redirects to `/login` after signup.
- BetterAuth rejects browser POSTs whose `Origin` doesn't match `BETTER_AUTH_URL` (403) — scripts must send `Origin: http://localhost:3000`.
- Dark mode = `.dark` class on `<html>` (shadcn tokens), persisted as `localStorage.theme` = `dark`/`light`, applied pre-paint by the inline script in `app/layout.jsx` (it also maps the legacy `booknook-dark` value). Do not look for daisyUI `data-theme`.
- Port 3000 is intentionally hard-coded across `package.json`, `.env`, `.env.example`, and the server's `.env` (`CLIENT_URL`); change all of them together.

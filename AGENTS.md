# AGENTS.md

Next.js 15 (App Router) front end for BookNook, plain JavaScript (no TS, `jsconfig.json` maps `@/*` to the repo root).

## Commands

- `npm run dev` — dev server, **pinned to port 3000** (`-p 3000`)
- `npm run build` — the only real verification step
- **No tests and no typecheck exist.** `npm run lint` (`next lint`) has no ESLint config installed, so it prompts interactively — don't rely on it
- **Never run `npm run build` while `npm run dev` is running**: both use `.next`, and the build wipes dev's `server/vendor-chunks`, leaving the dev server serving 500s (`ENOENT ... vendor-chunks`). Stop dev, build, then restart dev (a stale `.next` can be deleted safely)

## Architecture

- **Books/borrows come from Express + MongoDB**: every view fetches through `lib/shelf-api.js` (`shelfApi(path, { method, body })` → `BASE` (currently the deployed `https://booknook-server-lac.vercel.app`), throws the API's `data?.error`), which also exports the pure `filterBooks` / `sortNewest` list helpers. `shelfApi` swaps the BetterAuth session for a JWT (`GET /api/auth/token`, same origin; cached in memory and refreshed30s before `exp`, one retry on401) and sends it as `Authorization: Bearer …`. The server (`../booknook-server`, run `npm start`) owns the `addbooks` + `borrows` collections in the `booknook` DB and must be running. Endpoints: `GET/POST /addbooks`, `GET/PATCH/DELETE /addbooks/:id` (`?email=` owner filter, `?limit=` newest-first), `GET /borrows?email=`, `POST /borrows` (`{ bookId }`, decrements `availableCopies`, 7-day loan — `userEmail`/`userName` come from the token), `DELETE /borrows/:id` (restores the copy). Everything except `GET /addbooks` (without `?email=`) and `GET /addbooks/:id` requires that JWT; identity always comes from the token's claims, so a spoofed `?email=`/body field is answered `403`. There is no local store anymore — `lib/api.js` / `lib/store.js` / `lib/mock-data.js` were deleted; the demo catalogue is seeded by `../booknook-server/seed.mjs`.
- Pages in `app/**/page.jsx` are thin (often server) components; interactive UI lives in `components/*View.jsx` (client components).
- Auth is BetterAuth entirely inside this app: server config in `lib/auth.js` (served by `app/api/auth/[...all]/route.js`), browser client in `lib/auth-client.js` (single client, exports `signIn/signUp/signOut/useSession/authClient`). The `jwt()` / `jwtClient()` plugins serve `/api/auth/jwks` + `GET /token`, and the Express API verifies those tokens in `../booknook-server/src/auth.js` (remote JWKS at `/api/auth/jwks`, `iss`/`aud` checked against the server's `AUTH_URL` — it must equal this app's `BETTER_AUTH_URL`, `http://localhost:3000` in dev). Protected routes take identity from the token's claims, never from `?email=` or body fields. Route protection is `middleware.js` (session-cookie check on a hardcoded matcher list) — new private pages must be added there.
- UI is **Tailwind v4 + shadcn/ui** (`components/ui/*.jsx`, base-ui primitives, `components.json` has `tsx: false`). daisyUI was removed; design tokens are `:root` / `.dark` vars in `app/globals.css` plus custom classes `.eyebrow`, `.display`, `.chip`, `.lift`, `.grain`, `.empty-state`, `.skeleton-paper`, `.container-page`.
- Book covers are resized to a JPEG data URL in the browser (`lib/covers.js`) — no upload service or API key.

## Env vars (client `.env`)

`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (= `http://localhost:3000`), `MONGODB_URI` (BetterAuth collections in the `booknook` DB), `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (empty ⇒ startup warning, Google sign-in disabled). There is no `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_IMGBB_KEY` anymore.

## Gotchas

- BetterAuth `minPasswordLength: 6` matches `RegisterForm`'s client validation; `autoSignIn: false` because the form redirects to `/login` after signup.
- BetterAuth rejects browser POSTs whose `Origin` doesn't match `BETTER_AUTH_URL` (403) — scripts must send `Origin: http://localhost:3000`.
- Dark mode = `.dark` class on `<html>` (shadcn tokens), persisted as `localStorage.theme` = `dark`/`light`, applied pre-paint by the inline script in `app/layout.jsx` (it also maps the legacy `booknook-dark` value). Do not look for daisyUI `data-theme`.
- Port 3000 is intentionally hard-coded across `package.json`, `.env`, `.env.example`, and the server's `.env` (`CLIENT_URL`); change all of them together.

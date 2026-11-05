# BookNook — Client

A small online library: add a book, borrow a book, return a book.

**Live site:** https://book-nook-frontend-self.vercel.app
**API:** https://booknook-server-lac.vercel.app
**Repo:** https://github.com/ahsan-sadi/book-nook-frontend

This repository is the **Next.js front end**. Books, borrows and auth live in
MongoDB and are served by the sibling Express API in `../booknook-server` — see
that repo's [README](../booknook-server/README.md) for the endpoint reference.

## Features

- **Auth** — email/password (min 6 characters) and Google sign-in via BetterAuth,
  with a MongoDB session store. Private pages are guarded by `middleware.js`.
- **Catalogue** — live search + category chips, shareable URLs (`/books?search=…&category=…`),
  availability badges, newest-first ordering.
- **Book detail** — cover, availability meter, borrow confirmation dialog and a
  7-day loan summary.
- **My Books** — create / edit / delete your own titles. Covers are resized to a
  JPEG data URL in the browser (`lib/covers.js`), so no upload service or API key.
- **My Borrows** — every loan with its due date, a days-left badge (red when ≤ 2),
  and one-tap return that puts the copy back on the shelf.
- **Profile** — stats cards plus a category bar chart and a shelf-vs-loan pie chart (recharts).
- **Home** — Swiper hero slider, marquee ticker, New Arrivals, "how it works",
  top categories and a closing CTA.
- **UI** — Tailwind v4 + shadcn/ui design tokens, light/dark theme (`.dark` class,
  persisted), responsive down to 320px with a hamburger drawer below `lg`,
  reveal animations, custom 404, toast messages.

## Stack

Next.js 15 (App Router, plain JavaScript), Tailwind CSS v4 + shadcn/ui on
base-ui primitives, BetterAuth (JWT plugin + MongoDB adapter), Swiper,
framer-motion, recharts, lucide-react, react-hot-toast.

## How it fits together

```
Browser ── session cookie ──▶ Next.js (pages, middleware, BetterAuth at /api/auth/*)
   │
   └── Bearer JWT ──▶ Express API (../booknook-server) ──▶ MongoDB (booknook DB)
```

Two different credentials, deliberately:

1. **Session cookie** — BetterAuth issues it; `middleware.js` reads it to guard
   `/add-book`, `/my-books`, `/my-borrows`, `/profile` and `/books/:id`.
2. **JWT for the API** — `lib/shelf-api.js` exchanges the session for a
   15-minute JWT (`GET /api/auth/token`), caches it, and sends
   `Authorization: Bearer …` on every shelf call. The Express API verifies it
   against BetterAuth's JWKS and takes identity (`email`, `name`) from the
   token's claims — a spoofed `?email=` or body field is rejected with `403`.

Reads of the public catalogue (`GET /addbooks`, `GET /addbooks/:id`) need no
token, so signed-out visitors can still browse.

## Project structure

```
app/                  Routes (thin server components)
  page.jsx            Home
  books/page.jsx      Catalogue (?search, ?category)
  books/[id]/page.jsx Book detail + borrow
  login|register/     Auth forms (AuthShell layout)
  add-book/ my-books/ my-borrows/ profile/   Signed-in tools
  not-found.jsx       Custom 404
components/            Interactive UI (client components)
  Navbar.jsx          Sticky bar + responsive drawer
  *View.jsx           One per page (BooksView, MyBooksView, …)
  ui/                 shadcn/ui primitives
lib/
  auth.js             BetterAuth server config + jwt() plugin
  auth-client.js      Browser client (signIn/signUp/signOut/useSession)
  shelf-api.js        Express API client: token exchange + fetch helpers
  covers.js           Image → JPEG data URL
  constants.js        Categories, date formatting
middleware.js         Session-cookie route guard
```

## Environment variables

Copy `.env.example` to `.env` and fill it in:

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB connection string (BetterAuth collections in the `booknook` DB) |
| `BETTER_AUTH_SECRET` | yes | Secret BetterAuth signs sessions/JWTs with — any long random string |
| `BETTER_AUTH_URL` | yes | Origin of this app. `http://localhost:3000` in dev, the Vercel URL in prod. Also the JWT `iss`/`aud` the API checks, so it must equal the server's `AUTH_URL` |
| `GOOGLE_CLIENT_ID` | no | Google OAuth client ID; empty disables Google sign-in |
| `GOOGLE_CLIENT_SECRET` | no | Google OAuth client secret |

> `NEXT_SERVER_URL` may exist in your `.env` — nothing reads it; the API base URL
> is the `BASE` constant at the top of `lib/shelf-api.js`.

## Run locally

Requires **Node 20+** and a MongoDB Atlas cluster. Ports are pinned: the client
is always **3000**, the API **5000**.

```bash
# 1. Client
cp .env.example .env        # MONGODB_URI, BETTER_AUTH_SECRET, BETTER_AUTH_URL, Google secrets
npm install
npm run dev                 # http://localhost:3000

# 2. API (separate terminal)
cd ../booknook-server
cp .env.example .env        # fill in MONGODB_URI, CLIENT_URL, AUTH_URL
npm install
npm run seed                # one-off: load the 16-title demo catalogue
npm start                   # http://localhost:5000
```

`BETTER_AUTH_URL` (client) and `AUTH_URL` (server) must both be
`http://localhost:3000` in development; `CLIENT_URL` in the server is the
allowed CORS origin, also `http://localhost:3000`.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build — **the only real verification step** |
| `npm start` | Serve a previous build |
| `npm run lint` | `next lint` (no ESLint config installed yet, so it prompts interactively) |

> **Never run `npm run build` while `npm run dev` is running** — both use
> `.next`, and the build wipes the dev server's `vendor-chunks`, leaving it
> serving 500s. Stop dev, build, then restart dev.

## Pages

| Route | Access |
|---|---|
| `/` | Public |
| `/books`, `/books?search=&category=` | Public |
| `/login`, `/register` | Public |
| `/books/:id` | Session required |
| `/add-book`, `/my-books`, `/my-borrows`, `/profile` | Session required |

Guard list lives in `middleware.js` (`config.matcher`) — **new private pages
must be added there**.

## API

`lib/shelf-api.js` is the only place that talks to the Express API:

```js
await shelfApi("/addbooks");                                  // public
await shelfApi("/borrows?email=" + user.email);               // JWT attached automatically
await shelfApi("/addbooks/" + id, { method: "PATCH", body }); // JWT attached automatically
```

It attaches the Bearer token, refreshes it 30s before expiry, and retries once
on `401`. Errors are thrown as `new Error(data.error)` so callers can toast them.

Full route table: [`../booknook-server/README.md`](../booknook-server/README.md).

## Google sign-in

1. In **Google Cloud Console → Credentials**, create an **OAuth 2.0 Client ID of
   type “Web application”** (Android/TVs clients reject browser requests).
2. **Authorized redirect URIs** — must match byte-for-byte:
   ```
   http://localhost:3000/api/auth/callback/google
   https://book-nook-frontend-self.vercel.app/api/auth/callback/google
   ```
3. **Authorized JavaScript origins** — add the same two origins (without the path).
4. Put the client ID/secret in `.env` (dev) and in the Vercel project (prod).
5. If the consent screen is in **Testing** status, add your Google account under
   **Test users**, or sign-in is refused.

**“Access blocked: This app's request is invalid”** → the page hides the real
cause. Open the Google URL BetterAuth builds (or the browser dev tools) and read
the underlying error — `Error 400: redirect_uri_mismatch` means step 2 is wrong;
`access_denied` means step 5. No app code is involved in either case.

## Deployment (Vercel)

**Client** — import this repo, set `MONGODB_URI`, `BETTER_AUTH_SECRET`,
`BETTER_AUTH_URL=https://book-nook-frontend-self.vercel.app`, and the Google
credentials. Then point `BASE` in `lib/shelf-api.js` at the deployed API (it
already is) and add the production redirect URI from step 2 above.

**API** — see [`../booknook-server/README.md`](../booknook-server/README.md).
The important one: `AUTH_URL` must equal this app's `BETTER_AUTH_URL`, otherwise
every protected route answers `503`.

## Notes

- Detailed architecture notes for contributors live in [`AGENTS.md`](AGENTS.md).
- Book covers are stored inline in MongoDB as JPEG data URLs, so
  `express.json` on the server allows 2 MB bodies.
- The demo shelf is seeded by `../booknook-server/seed.mjs`; the 16 demo titles
  belong to seeded owners, so only those owners can edit/delete them.

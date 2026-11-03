# BookNook

A small online library: add a book, borrow a book, return a book.

**Live site:** ADD_LIVE_URL_HERE

## Features
- Email/password sign-in with BetterAuth + MongoDB (Google sign-in ready once credentials are added)
- Standless demo shelf: 16 seed titles render on the server and every add/edit/borrow/return persists in `localStorage`
- Swiper.js hero slider, live-filtering catalogue, and a New Arrivals section
- Borrow for 7 days, track available copies, block double borrows — all in the browser
- Light/dark themes (shadcn `.dark` class), responsive layouts, custom 404, toast messages

## Stack
Next.js 15 (App Router, JavaScript), Tailwind CSS v4 + shadcn/ui (base-ui), BetterAuth
(JWT plugin, MongoDB adapter), Swiper, framer-motion, recharts, lucide-react,
react-hot-toast. Books/borrows live in `lib/store.js` + `lib/mock-data.js` — no API
server is required. `../booknook-server` (Express) is optional and decoupled.

## Run locally

Pinned to **port 3000** (`npm run dev` passes `-p 3000`). `BETTER_AUTH_URL` here and
`CLIENT_URL` in the server must both be `http://localhost:3000`.

```bash
cp .env.example .env   # fill in MONGODB_URI + Google secrets
npm install
npm run dev            # http://localhost:3000
```

Google sign-in: add `http://localhost:3000/api/auth/callback/google` as an authorized
redirect URI in Google Cloud and put the client ID/secret in the client `.env`.

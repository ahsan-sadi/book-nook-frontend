# BookNook

A small online library: add a book, borrow a book, return a book.

**Live site:** ADD_LIVE_URL_HERE
**Server repo:** `../booknook-server` (Express + MongoDB API)

## Features
- Email/password and Google sign-in with BetterAuth and the MongoDB adapter
- Swiper.js hero slider and a New Arrivals section showing the 6 newest books
- Add, edit and delete your own books, with covers uploaded to imgbb
- Borrow for 7 days, track available copies, and block double borrowing
- Light and dark themes, plus responsive layouts from phone to desktop
- Private routes stay signed in on reload, with a custom 404 and toast messages throughout

## Stack
Next.js (App Router), JavaScript, Tailwind CSS v4 + daisyUI + shadcn/ui, BetterAuth (JWT plugin), MongoDB, Swiper, react-hot-toast, Express (separate app)

## Run locally

This app is pinned to **port 3001** (`npm run dev` passes `-p 3001`). Every URL that
must agree — `BETTER_AUTH_URL` here and `CLIENT_URL` in the server — uses
`http://localhost:3001`. If you change the port, change all of them.

```bash
# 1. Client (this repo)
cp .env.example .env   # fill in DB_URL, NEXT_PUBLIC_IMGBB_KEY, Google secrets
npm install
npm run dev            # http://localhost:3001

# 2. API (../booknook-server)
cd ../booknook-server
cp .env.example .env   # MONGODB_URI must point at the same database
npm install
npm run dev            # http://localhost:5000
```

The client reads the API URL from `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`).

Google sign-in: add `http://localhost:3001/api/auth/callback/google` as an authorized
redirect URI in Google Cloud and put the client ID/secret in the client `.env`.
# book-nook-frontend

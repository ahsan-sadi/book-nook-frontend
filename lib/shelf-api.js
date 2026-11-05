const BASE = "https://booknook-server-lac.vercel.app";

// BetterAuth signs a 15-minute session JWT (GET /api/auth/token, same origin,
// session cookie). Keep one in memory and refresh it shortly before it expires
// so a shelf call doesn't need an extra round-trip on every request.
let cached = { token: "", expiresAt: 0 };

// Read `exp` purely to time the refresh — the signature is verified server-side.
const readExpiry = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return Number(payload.exp) || 0;
  } catch {
    return 0;
  }
};

async function getToken() {
  // During SSR there is no session cookie to exchange; public reads still work.
  if (typeof window === "undefined") return "";
  const now = Date.now();
  if (cached.token && now < cached.expiresAt - 30_000) return cached.token;
  try {
    const res = await fetch("/api/auth/token", { credentials: "include" });
    if (!res.ok) {
      cached = { token: "", expiresAt: 0 };
      return "";
    }
    const { token } = await res.json();
    if (!token) return "";
    const exp = readExpiry(token);
    cached = { token, expiresAt: exp ? exp * 1000 : now + 60_000 };
    return token;
  } catch {
    return "";
  }
}

export async function shelfApi(path, { method = "GET", body } = {}) {
  const send = (token) =>
    fetch(`${BASE}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

  let token = await getToken();
  let res = await send(token);

  // Token expired mid-session: drop it, mint a fresh one, try once more.
  if (res.status === 401 && token) {
    cached = { token: "", expiresAt: 0 };
    token = await getToken();
    res = await send(token);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(data?.error || "The shelf is unavailable right now.");
  return data;
}

/** Newest first. */
export function sortNewest(list) {
  return [...list].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  );
}

/** Free-text match on title / author, plus an optional category filter. */
export function filterBooks(list, { search = "", category = "All" } = {}) {
  const q = String(search).trim().toLowerCase();
  return sortNewest(list).filter((b) => {
    if (category && category !== "All" && b.category !== category) return false;
    if (!q) return true;
    return `${b.title} ${b.author}`.toLowerCase().includes(q);
  });
}

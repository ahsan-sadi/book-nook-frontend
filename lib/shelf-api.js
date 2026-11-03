// Thin client for the Express shelf (booknook-server, /addbooks collection).
// Books live in Mongo, so these are real HTTP calls rather than lib/api's local store.
const BASE = "http://localhost:5000";

export async function shelfApi(path, { method = "GET", body } = {}) {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok)
        throw new Error(data?.error || "The shelf is unavailable right now.");
    return data;
}

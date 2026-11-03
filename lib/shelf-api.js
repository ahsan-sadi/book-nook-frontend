// Shelf data: the HTTP client for the Express API (booknook-server) plus the
// pure list helpers the catalogue views filter with. Books live in Mongo, so
// these are real fetches rather than a local store.
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

/** Newest first. */
export function sortNewest(list) {
    return [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
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

// Books & borrows are served by the local mock store (lib/store.js) instead of the
// Express API, so the client runs standalone. Same call shape as before:
//   api("/books?email=…", { auth: true })
//   api("/books", { method: "POST", body, auth: true })
import { createBook, updateBook, removeBook, createBorrow, removeBorrow, getBook, listBooks, listBorrows } from "./store";

const wait = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export async function api(path, { method = "GET", body, auth = false } = {}) {
    void auth; // mock data is local — no bearer token needed
    await wait();

    const [pathname, query = ""] = path.split("?");
    const params = new URLSearchParams(query);
    const segments = pathname.split("/").filter(Boolean); // e.g. ["books", "bk-123"]

    if (segments[0] === "books") {
        const id = segments[1];

        if (method === "GET" && !id)
            return listBooks({
                search: params.get("search") || "",
                category: params.get("category") || "All",
                email: params.get("email") || "",
            });

        if (method === "GET" && id) {
            const book = getBook(id);
            if (!book)
                throw new Error("We couldn't find that book — it may have been removed.");
            return book;
        }

        if (method === "POST" && !id)
            return createBook(body || {});

        if (method === "PATCH" && id)
            return updateBook(id, body || {});

        if (method === "DELETE" && id) {
            removeBook(id);
            return { ok: true };
        }
    }

    if (segments[0] === "borrows") {
        const id = segments[1];

        if (method === "GET" && !id)
            return listBorrows(params.get("email") || "");

        if (method === "POST" && !id)
            return createBorrow(body || {});

        if (method === "DELETE" && id) {
            removeBorrow(id);
            return { ok: true };
        }
    }

    throw new Error("That action isn't available in the demo shelf.");
}

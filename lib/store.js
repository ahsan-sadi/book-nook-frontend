"use client";
// In-memory + localStorage store for books and borrows. Replaces the Express API so the
// client runs standalone: mutations persist in the browser, SSR renders the seed catalogue.
import { useSyncExternalStore } from "react";
import { SEED_BOOKS, SEED_BORROWS, LOAN_DAYS, filterBooks, sortNewest } from "./mock-data";

const KEY = "booknook:shelf:v2";
const SERVER_STATE = { books: SEED_BOOKS, borrows: SEED_BORROWS };

let state = null;
const listeners = new Set();

function hydrate() {
    if (typeof window === "undefined")
        return SERVER_STATE;
    if (state)
        return state;
    try {
        const raw = window.localStorage.getItem(KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        state = parsed && Array.isArray(parsed.books) && Array.isArray(parsed.borrows)
            ? parsed
            : { books: SEED_BOOKS, borrows: SEED_BORROWS };
    }
    catch {
        state = { books: SEED_BOOKS, borrows: SEED_BORROWS };
    }
    return state;
}

function commit(next) {
    state = next;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
    }
    catch { /* quota reached — the session still works in memory */ }
    listeners.forEach((l) => l());
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

const getSnapshot = () => hydrate();
const getServerSnapshot = () => SERVER_STATE;

/** Reactive view of the whole shelf — safe to render on the server. */
export function useShelf() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/* ----------------------------- selectors ----------------------------- */

export function listBooks({ search = "", category = "All", email = "" } = {}) {
    return filterBooks(hydrate().books, { search, category, email });
}

export function getBook(id) {
    return hydrate().books.find((b) => b._id === id) || null;
}

export function listBorrows(email = "") {
    const list = email ? hydrate().borrows.filter((b) => b.userEmail === email) : hydrate().borrows;
    return [...list].sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
}

/* ----------------------------- mutations ----------------------------- */

export function createBook(input) {
    const now = new Date().toISOString();
    const total = Math.max(1, Number(input.totalCopies) || 1);
    const book = {
        _id: uid("bk"),
        title: input.title,
        author: input.author,
        category: input.category,
        description: input.description,
        image: input.image,
        totalCopies: total,
        availableCopies: total,
        addedByName: input.addedByName || "Anonymous reader",
        addedByEmail: input.addedByEmail || "",
        createdAt: now,
    };
    commit({ ...hydrate(), books: [book, ...hydrate().books] });
    return book;
}

export function updateBook(id, patch) {
    let updated = null;
    const books = hydrate().books.map((b) => {
        if (b._id !== id)
            return b;
        updated = { ...b, ...patch };
        if (patch.totalCopies != null) {
            const total = Math.max(1, Number(patch.totalCopies) || 1);
            const loaned = b.totalCopies - b.availableCopies;
            updated.totalCopies = total;
            updated.availableCopies = Math.max(0, total - loaned);
        }
        return updated;
    });
    if (!updated)
        throw new Error("That book is no longer on the shelf.");
    commit({ ...hydrate(), books });
    return updated;
}

export function removeBook(id) {
    const current = hydrate();
    if (!current.books.some((b) => b._id === id))
        throw new Error("That book is no longer on the shelf.");
    commit({
        books: current.books.filter((b) => b._id !== id),
        borrows: current.borrows.filter((b) => b.bookId !== id),
    });
}

export function createBorrow({ bookId, userEmail, userName }) {
    const book = getBook(bookId);
    if (!book)
        throw new Error("That book is no longer on the shelf.");
    if (book.availableCopies <= 0)
        throw new Error("All copies are out — check back after it's returned.");
    if (!userEmail)
        throw new Error("Please sign in to borrow a book.");

    const now = new Date();
    const due = new Date(now.getTime() + LOAN_DAYS * 86400000);
    const borrow = {
        _id: uid("bw"),
        bookId: book._id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookImage: book.image,
        borrowDate: now.toISOString(),
        returnDate: due.toISOString(),
        userEmail,
        userName: userName || "",
    };
    const current = hydrate();
    commit({
        books: current.books.map((b) => b._id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b),
        borrows: [borrow, ...current.borrows],
    });
    return borrow;
}

export function removeBorrow(id) {
    const current = hydrate();
    const borrow = current.borrows.find((b) => b._id === id);
    if (!borrow)
        throw new Error("That loan record wasn't found.");
    commit({
        books: current.books.map((b) => b._id === borrow.bookId
            ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) }
            : b),
        borrows: current.borrows.filter((b) => b._id !== id),
    });
}

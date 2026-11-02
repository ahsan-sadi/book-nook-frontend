// Local catalogue used when the app runs standalone (no API server).
// Server-safe: no window/localStorage access, so pages can render from this during SSR.

const cover = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;

export const SEED_BOOKS = [
    {
        _id: "bk-circe", title: "Circe", author: "Madeline Miller", category: "Fiction",
        description: "A sorceress carved out of the blood of Titans tells her own story — a lush retelling of the witch from the Odyssey, perfect for slow Sunday reading.",
        totalCopies: 3, availableCopies: 3, image: cover("9780316556347"),
        addedByName: "Nusrat Jahan", addedByEmail: "nusrat@booknook.app", createdAt: "2026-10-24T09:15:00.000Z",
    },
    {
        _id: "bk-project-hail-mary", title: "Project Hail Mary", author: "Andy Weir", category: "Others",
        description: "A lone astronaut wakes up with amnesia and the weight of humanity on his shoulders. Funny, tense, and secretly a story about friendship.",
        totalCopies: 2, availableCopies: 1, image: cover("9780593135204"),
        addedByName: "BookNook Demo", addedByEmail: "demo@booknook.app", createdAt: "2026-10-20T14:40:00.000Z",
    },
    {
        _id: "bk-sapiens", title: "Sapiens", author: "Yuval Noah Harari", category: "History",
        description: "A brief history of humankind — from an insignificant ape to the owner of the planet. The book everyone argues about at dinner parties.",
        totalCopies: 4, availableCopies: 4, image: cover("9780062316097"),
        addedByName: "Ayesha Rahman", addedByEmail: "ayesha@booknook.app", createdAt: "2026-10-16T11:05:00.000Z",
    },
    {
        _id: "bk-caterpillar", title: "The Very Hungry Caterpillar", author: "Eric Carle", category: "Kids",
        description: "Five days of eating, one long nap, and a beautiful surprise. A first book that has carried a generation through bedtime.",
        totalCopies: 5, availableCopies: 5, image: cover("9780399226908"),
        addedByName: "Nusrat Jahan", addedByEmail: "nusrat@booknook.app", createdAt: "2026-10-12T16:20:00.000Z",
    },
    {
        _id: "bk-brief-history", title: "A Brief History of Time", author: "Stephen Hawking", category: "Science",
        description: "Black holes, time and the beginning of everything, explained without a single equation. Hawking at his most generous.",
        totalCopies: 2, availableCopies: 1, image: cover("9780553380163"),
        addedByName: "Tanvir Ahmed", addedByEmail: "tanvir@booknook.app", createdAt: "2026-10-08T08:45:00.000Z",
    },
    {
        _id: "bk-left-hand", title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", category: "Fiction",
        description: "An envoy on a frozen world where people are neither men nor women — a quiet, radical novel about loyalty and otherness.",
        totalCopies: 2, availableCopies: 2, image: cover("9780441478125"),
        addedByName: "BookNook Demo", addedByEmail: "demo@booknook.app", createdAt: "2026-10-03T13:30:00.000Z",
    },
    {
        _id: "bk-educated", title: "Educated", author: "Tara Westover", category: "Others",
        description: "A woman raised off-grid in Idaho teaches herself enough to reach Cambridge. A memoir about the price of learning to see for yourself.",
        totalCopies: 3, availableCopies: 3, image: cover("9780399590504"),
        addedByName: "Ayesha Rahman", addedByEmail: "ayesha@booknook.app", createdAt: "2026-09-27T10:10:00.000Z",
    },
    {
        _id: "bk-charlotte", title: "Charlotte's Web", author: "E. B. White", category: "Kids",
        description: "\"Some pig.\" A spider, a rat and a pig called Wilbur — still the gentlest way to teach a child about endings.",
        totalCopies: 4, availableCopies: 4, image: cover("9780064400558"),
        addedByName: "Nusrat Jahan", addedByEmail: "nusrat@booknook.app", createdAt: "2026-09-21T15:55:00.000Z",
    },
    {
        _id: "bk-cosmos", title: "Cosmos", author: "Carl Sagan", category: "Science",
        description: "A tour of the universe and the humans who tried to understand it — lyrical science writing that still feels like looking up.",
        totalCopies: 2, availableCopies: 2, image: cover("9780345539434"),
        addedByName: "Tanvir Ahmed", addedByEmail: "tanvir@booknook.app", createdAt: "2026-09-15T12:00:00.000Z",
    },
    {
        _id: "bk-warmth", title: "The Warmth of Other Suns", author: "Isabel Wilkerson", category: "History",
        description: "Three lives, one migration: six million Black Americans leaving the South, told through the people who actually went.",
        totalCopies: 2, availableCopies: 2, image: cover("9780679763888"),
        addedByName: "Ayesha Rahman", addedByEmail: "ayesha@booknook.app", createdAt: "2026-09-09T09:25:00.000Z",
    },
    {
        _id: "bk-thinking", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Science",
        description: "The two systems that drive how we decide — and why the quick one is so often wrong. Dense, surprising, worth the slow read.",
        totalCopies: 3, availableCopies: 3, image: cover("9780374533557"),
        addedByName: "BookNook Demo", addedByEmail: "demo@booknook.app", createdAt: "2026-09-02T17:15:00.000Z",
    },
    {
        _id: "bk-hobbit", title: "The Hobbit", author: "J. R. R. Tolkien", category: "Fiction",
        description: "There and back again: a comfort read with a dragon in it. Ideal for anyone easing back into longer books.",
        totalCopies: 4, availableCopies: 4, image: cover("9780547928227"),
        addedByName: "Tanvir Ahmed", addedByEmail: "tanvir@booknook.app", createdAt: "2026-08-26T14:45:00.000Z",
    },
    {
        _id: "bk-pachinko", title: "Pachinko", author: "Min Jin Lee", category: "Fiction",
        description: "Four generations of a Korean family in Japan — sweeping, patient, and quietly furious about what history does to ordinary people.",
        totalCopies: 2, availableCopies: 2, image: cover("9781455563937"),
        addedByName: "Nusrat Jahan", addedByEmail: "nusrat@booknook.app", createdAt: "2026-08-18T10:35:00.000Z",
    },
    {
        _id: "bk-guns-germs", title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "History",
        description: "Why some societies ended up with steel and others did not — a grand, geographic argument about how the modern world was drawn.",
        totalCopies: 2, availableCopies: 2, image: cover("9780393354324"),
        addedByName: "Ayesha Rahman", addedByEmail: "ayesha@booknook.app", createdAt: "2026-08-10T13:05:00.000Z",
    },
    {
        _id: "bk-crawdads", title: "Where the Crawdads Sing", author: "Delia Owens", category: "Fiction",
        description: "A girl raised alone in the marsh, a death in town, and a courtroom that finally listens. Lyrical, moody, hard to put down.",
        totalCopies: 3, availableCopies: 3, image: cover("9780735219090"),
        addedByName: "BookNook Demo", addedByEmail: "demo@booknook.app", createdAt: "2026-08-01T11:50:00.000Z",
    },
    {
        _id: "bk-never-let-me-go", title: "Never Let Me Go", author: "Kazuo Ishiguro", category: "Fiction",
        description: "Three friends discover what their sheltered school was really for. A quiet science-fiction novel that reads like a memory.",
        totalCopies: 2, availableCopies: 2, image: cover("9781400078776"),
        addedByName: "Tanvir Ahmed", addedByEmail: "tanvir@booknook.app", createdAt: "2026-07-24T16:30:00.000Z",
    },
];

// Two loans already sitting on the demo reader's account.
export const SEED_BORROWS = [
    {
        _id: "bw-1", bookId: "bk-project-hail-mary", bookTitle: "Project Hail Mary", bookAuthor: "Andy Weir",
        bookImage: cover("9780593135204"),
        borrowDate: "2026-10-27T10:00:00.000Z", returnDate: "2026-11-03T10:00:00.000Z",
        userEmail: "demo@booknook.app", userName: "BookNook Demo",
    },
    {
        _id: "bw-2", bookId: "bk-brief-history", bookTitle: "A Brief History of Time", bookAuthor: "Stephen Hawking",
        bookImage: cover("9780553380163"),
        borrowDate: "2026-10-30T15:00:00.000Z", returnDate: "2026-11-06T15:00:00.000Z",
        userEmail: "demo@booknook.app", userName: "BookNook Demo",
    },
];

export const LOAN_DAYS = 7;

/** Newest first. */
export function sortNewest(list) {
    return [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

/** Free-text match on title / author, plus optional category & owner filters. */
export function filterBooks(list, { search = "", category = "All", email = "" } = {}) {
    const q = String(search).trim().toLowerCase();
    return sortNewest(list).filter((b) => {
        if (category && category !== "All" && b.category !== category) return false;
        if (email && b.addedByEmail !== email) return false;
        if (!q) return true;
        return `${b.title} ${b.author}`.toLowerCase().includes(q);
    });
}

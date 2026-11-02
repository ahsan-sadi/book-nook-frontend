import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
// Reads the session cookie on the server, so reloading a private route never bounces a signed-in user to /login
export function middleware(req) {
    if (!getSessionCookie(req)) {
        const url = new URL("/login", req.url);
        url.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}
export const config = { matcher: ["/add-book", "/my-books", "/my-borrows", "/profile", "/books/:id"] };

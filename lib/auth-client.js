import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
// BetterAuth lives in this Next app (app/api/auth/[...all]) — same origin, so no baseURL.
// jwtClient pairs with the jwt() server plugin: it maps GET /token, which api.js calls as authClient.token().
export const authClient = createAuthClient({
    plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

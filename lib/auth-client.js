import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// BetterAuth lives in this Next app (app/api/auth/[...all]) — same origin, so no baseURL
// (a hardcoded baseURL pointed at the wrong port and failed BetterAuth's origin check).
// jwtClient pairs with the jwt() server plugin: it maps GET /token for bearer-token calls.
export const authClient = createAuthClient({
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

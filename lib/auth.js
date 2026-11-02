import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { client, db } from "./mongodb";

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    // Must equal CLIENT_URL in the Express server: it verifies JWTs with issuer = CLIENT_URL
    // and fetches the public keys from `${CLIENT_URL}/api/auth/jwks`.
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
        // RegisterForm allows 6-character passwords; better-auth defaults to 8.
        minPasswordLength: 6,
        // RegisterForm redirects to /login after signup, so don't sign in behind its back.
        autoSignIn: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    // Issues the Bearer JWTs the Express API accepts and serves /api/auth/jwks.
    plugins: [jwt({ jwt: { issuer: process.env.BETTER_AUTH_URL } })],
});

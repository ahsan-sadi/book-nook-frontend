import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  // Origin this app runs on (next dev -p 3000). Also the JWT issuer the
  // optional Express API (../booknook-server) verifies against.
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    // RegisterForm allows 6-character passwords; better-auth defaults to 8.
    minPasswordLength: 6,
    // RegisterForm redirects to /login after signup — don't sign in behind its back.
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  // Serves /api/auth/jwks and GET /token — the contract ../booknook-server verifies against.
  plugins: [jwt({ jwt: { issuer: process.env.BETTER_AUTH_URL } })],
});

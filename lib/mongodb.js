import { MongoClient } from "mongodb";
// One cached Mongo connection for the whole app (avoids a new client per dev HMR reload).
const globalForMongo = globalThis;
export const client = globalForMongo._mongo ?? new MongoClient(process.env.DB_URL || process.env.MONGODB_URI);
if (process.env.NODE_ENV !== "production")
    globalForMongo._mongo = client;
// Same database the Express API uses for books/borrows (DB_NAME in its .env).
export const db = client.db(process.env.DB_NAME || "booknook");

import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const config = {
    // The parent folder (D:\booknook) has its own lockfile, which makes Next infer the
    // wrong workspace root and print a warning on every build.
    outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
    images: {
        // book covers (imgbb), Google / external profile photos, and pasted http:// URLs on localhost
        remotePatterns: [
            { protocol: "https", hostname: "**" },
            { protocol: "http", hostname: "localhost" },
            { protocol: "http", hostname: "127.0.0.1" },
        ],
    },
};
export default config;

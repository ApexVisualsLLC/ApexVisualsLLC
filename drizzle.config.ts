import type { Config } from "drizzle-kit";
import { resolveDatabaseUrl } from "./src/lib/db/env";

// Unlike Next.js (which auto-loads .env.local), drizzle-kit is a standalone
// CLI and doesn't — load it explicitly so `npm run db:generate` etc. see the
// same env vars the app does. Missing file is fine (e.g. vars injected
// another way in CI); only a genuinely malformed file should be loud.
try {
  process.loadEnvFile(".env.local");
} catch (err) {
  if (err instanceof Error && "code" in err && err.code !== "ENOENT") {
    throw err;
  }
}

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl) {
  throw new Error(
    "No database URL env var is set (checked DATABASE_URL, POSTGRES_URL, STORAGE_DATABASE_URL, STORAGE_POSTGRES_URL)."
  );
}

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config;

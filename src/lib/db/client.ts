import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { resolveDatabaseUrl } from "./env";

type Database = ReturnType<typeof drizzle<typeof schema>>;

let cached: Database | null = null;

/**
 * Lazily creates (and caches) the DB connection on first actual use, rather
 * than at module-import time. This matters: pages that merely import this
 * module — like the /admin login form, which needs no database access at all
 * before a session exists — must not crash just because DATABASE_URL isn't
 * configured yet. The error only surfaces when a query actually runs.
 */
function getClient(): Database {
  if (cached) return cached;

  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    throw new Error(
      "No database URL env var is set (checked DATABASE_URL, POSTGRES_URL, STORAGE_DATABASE_URL, STORAGE_POSTGRES_URL). Connect the Vercel Postgres integration, or run `vercel env pull .env.local` locally."
    );
  }

  const sql = neon(databaseUrl);
  cached = drizzle(sql, { schema });
  return cached;
}

export const db: Database = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});

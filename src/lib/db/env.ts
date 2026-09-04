/**
 * Vercel's Postgres/Neon marketplace integration has used different env var
 * names depending on whether a custom resource prefix was set at connect
 * time (this project's ended up prefixed as STORAGE_*). Checked in order of
 * preference; shared by both the runtime client and drizzle-kit's config so
 * they never drift out of sync with each other.
 */
export function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.STORAGE_DATABASE_URL ??
    process.env.STORAGE_POSTGRES_URL
  );
}

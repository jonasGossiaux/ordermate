import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

let cached: Database | null = null;

/**
 * Lazy database client. De verbinding wordt pas gemaakt bij de eerste query,
 * niet bij het importeren. Zo blijft `next build` werken zonder DATABASE_URL.
 */
export function getDb(): Database {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL ontbreekt. Voeg in Vercel een Postgres-database toe via het tabblad Storage, of zet DATABASE_URL in .env.local voor lokaal testen.",
    );
  }

  cached = drizzle(neon(url), { schema });
  return cached;
}

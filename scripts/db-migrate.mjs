// Wordt uitgevoerd vóór `next build`.
// Voert de Drizzle-migraties uit via de Neon HTTP-driver. Dat werkt betrouwbaar
// in de Vercel build-omgeving en met de (pooled) DATABASE_URL die de Neon-
// integratie instelt — in tegenstelling tot `drizzle-kit migrate`, dat een
// directe TCP-verbinding nodig heeft.
//
// Lokaal zonder DATABASE_URL: overslaan, zodat `npm run build` blijft werken.
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

// Lokaal: lees DATABASE_URL uit .env.local (indien dotenv beschikbaar is).
// Op Vercel staat DATABASE_URL al in process.env, dus dit is daar een no-op.
try {
  const { config } = await import("dotenv");
  config({ path: ".env.local" });
  config();
} catch {
  // dotenv niet beschikbaar (bv. productie zonder devDependencies) — prima.
}

const url = process.env.DATABASE_URL;

if (!url) {
  console.log(
    "[db-migrate] Geen DATABASE_URL gevonden — migraties overgeslagen.",
  );
  process.exit(0);
}

console.log("[db-migrate] Migraties uitvoeren via Neon HTTP...");
try {
  const db = drizzle(neon(url));
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[db-migrate] Klaar — database is up-to-date.");
} catch (error) {
  console.error("[db-migrate] Migratie mislukt:", error);
  process.exit(1);
}

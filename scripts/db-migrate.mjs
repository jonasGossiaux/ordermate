// Wordt uitgevoerd vóór `next build`.
// - Op Vercel (DATABASE_URL aanwezig): voert de Drizzle-migraties uit zodat de
//   tabellen bestaan voor de eerste deploy.
// - Lokaal zonder DATABASE_URL: slaat over, zodat `npm run build` blijft werken.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log(
    "[db-migrate] Geen DATABASE_URL gevonden — migraties overgeslagen.",
  );
  process.exit(0);
}

console.log("[db-migrate] Migraties uitvoeren op de database...");
try {
  execSync("drizzle-kit migrate", { stdio: "inherit" });
  console.log("[db-migrate] Klaar.");
} catch (error) {
  console.error("[db-migrate] Migratie mislukt.");
  throw error;
}

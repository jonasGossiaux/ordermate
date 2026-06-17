import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Laad lokale env-bestanden indien aanwezig (handig voor lokaal testen).
// Op Vercel komt DATABASE_URL gewoon uit process.env.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});

// Genereert een scrypt-hash voor het beheerderswachtwoord.
// Gebruik (wachtwoord via stdin, komt niet in je shell-history):
//   printf '%s' 'JouwWachtwoord' | node scripts/hash-password.mjs
//
// Zet de uitvoer als ADMIN_PASSWORD_HASH in Vercel (en .env.local lokaal).
import { randomBytes, scryptSync } from "node:crypto";

const password = await new Promise((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => resolve(data.replace(/\r?\n$/, "")));
});

if (!password) {
  console.error("Geen wachtwoord ontvangen via stdin.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
process.stdout.write(`${salt.toString("hex")}:${hash.toString("hex")}\n`);

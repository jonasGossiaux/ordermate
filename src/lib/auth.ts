import "server-only";

import { cookies } from "next/headers";
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

// Eén beheerder ("admin"). De credentials staan in environment variables, niet
// in de database:
//   ADMIN_USERNAME       — de gebruikersnaam (bv. "admin")
//   ADMIN_PASSWORD_HASH  — scrypt-hash in de vorm "<salthex>:<hashhex>"
//   AUTH_SECRET          — geheime sleutel om het sessiecookie te ondertekenen
//
// Het wachtwoord zelf wordt nergens bewaard; we vergelijken enkel hashes in
// constante tijd.

const COOKIE = "om_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dagen
const KEYLEN = 64;

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET ontbreekt in de omgeving.");
  return value;
}

/** Maak een scrypt-hash "<salthex>:<hashhex>" voor een wachtwoord. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEYLEN);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Controleer gebruikersnaam + wachtwoord tegen de env-credentials. */
export function verifyCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !stored) return false;

  const userOk = safeEqual(
    Buffer.from(username),
    Buffer.from(expectedUser),
  );

  const [saltHex, hashHex] = stored.split(":");
  let passOk = false;
  if (saltHex && hashHex) {
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, Buffer.from(saltHex, "hex"), KEYLEN);
    passOk = safeEqual(actual, expected);
  }

  // Beide checks altijd uitvoeren (geen vroege return) om timing-lekken te
  // beperken.
  return userOk && passOk;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Zet een ondertekend, httpOnly sessiecookie voor de beheerder. */
export async function createSession(): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ sub: "admin", exp })).toString(
    "base64url",
  );
  const token = `${payload}.${sign(payload)}`;

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Verwijder het sessiecookie (uitloggen). */
export async function destroySession(): Promise<void> {
  (await cookies()).set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** True als de huidige bezoeker een geldig beheerderscookie heeft. */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  if (!safeEqual(Buffer.from(sig), Buffer.from(sign(payload)))) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data?.sub !== "admin") return false;
    if (typeof data.exp !== "number" || data.exp * 1000 < Date.now())
      return false;
    return true;
  } catch {
    return false;
  }
}

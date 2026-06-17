import "server-only";

import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

// Anoniem "wie ben je"-token. Geen account, enkel een willekeurige id in een
// httpOnly-cookie zodat iemand zijn eigen broodje kan verwijderen — en dat van
// anderen niet. Het token wordt nooit naar de client gestuurd.
const COOKIE = "om_uid";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 jaar

/** Leest het bestaande bezoekerstoken, of null. (Voor server components.) */
export async function getOwnerToken(): Promise<string | null> {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

/** Geeft het bezoekerstoken terug en maakt er één aan als het nog niet bestaat.
 *  Mag enkel vanuit een Server Function/Route Handler (zet een cookie). */
export async function ensureOwnerToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE)?.value;
  if (existing) return existing;

  const token = randomBytes(18).toString("base64url");
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return token;
}

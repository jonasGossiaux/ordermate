"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import { getDb } from "@/db";
import { groupOrders, orderItems } from "@/db/schema";
import { getMenu, getMenuItem } from "@/data/menus";
import {
  createSession,
  destroySession,
  isAdmin,
  verifyCredentials,
} from "@/lib/auth";
import { ensureOwnerToken, getOwnerToken } from "@/lib/owner";

// Leesbare ids zonder dubbelzinnige tekens (geen 0/o/1/l).
const alphabet = "23456789abcdefghijkmnopqrstuvwxyz";
const newOrderId = customAlphabet(alphabet, 8);
const newItemId = customAlphabet(alphabet, 16);

export type FormState = {
  ok: boolean;
  error?: string;
  /** Id van het zojuist toegevoegde item; uniek per geslaagde toevoeging. */
  itemId?: string;
} | null;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

// ── Authenticatie (beheerder) ────────────────────────────────────────────────

export async function login(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = text(formData, "username");
  const password = typeof formData.get("password") === "string"
    ? (formData.get("password") as string)
    : "";
  const next = text(formData, "next");

  if (!username || !password)
    return { ok: false, error: "Vul gebruikersnaam en wachtwoord in." };

  if (!verifyCredentials(username, password))
    return { ok: false, error: "Onjuiste gebruikersnaam of wachtwoord." };

  await createSession();
  redirect(next && next.startsWith("/") ? next : "/");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function createGroupOrder(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = text(formData, "name");
  const menuId = text(formData, "menuId");

  if (!name) return { ok: false, error: "Geef je bestelling een naam." };
  if (name.length > 100)
    return { ok: false, error: "De naam is te lang (max. 100 tekens)." };
  if (!getMenu(menuId))
    return { ok: false, error: "Kies een geldig menu." };

  const id = newOrderId();
  await getDb().insert(groupOrders).values({ id, name, menuId });

  revalidatePath("/");
  redirect(`/bestelling/${id}`);
}

export async function addOrderItem(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const groupOrderId = text(formData, "groupOrderId");
  const personName = text(formData, "personName");
  const menuItemId = text(formData, "menuItemId");
  const comment = text(formData, "comment");

  if (!groupOrderId) return { ok: false, error: "Onbekende bestelling." };
  if (!personName) return { ok: false, error: "Vul je naam in." };
  if (personName.length > 80)
    return { ok: false, error: "Je naam is te lang (max. 80 tekens)." };
  if (!menuItemId) return { ok: false, error: "Kies een broodje." };
  if (comment.length > 300)
    return { ok: false, error: "De opmerking is te lang (max. 300 tekens)." };

  const db = getDb();
  const found = await db
    .select()
    .from(groupOrders)
    .where(eq(groupOrders.id, groupOrderId))
    .limit(1);
  const order = found[0];

  if (!order) return { ok: false, error: "Deze bestelling bestaat niet meer." };
  if (order.status !== "open")
    return { ok: false, error: "Deze bestelling is gesloten." };

  const menuItem = getMenuItem(order.menuId, menuItemId);
  if (!menuItem) return { ok: false, error: "Dit broodje staat niet op het menu." };
  if (menuItem.soldOut)
    return { ok: false, error: `${menuItem.name} is momenteel uitverkocht.` };

  const itemId = newItemId();
  const ownerToken = await ensureOwnerToken();
  await db.insert(orderItems).values({
    id: itemId,
    groupOrderId,
    personName,
    menuItemId,
    itemName: menuItem.name,
    comment: comment || null,
    ownerToken,
  });

  revalidatePath(`/bestelling/${groupOrderId}`);
  return { ok: true, itemId };
}

export async function deleteOrderItem(formData: FormData): Promise<void> {
  const id = text(formData, "id");
  if (!id) return;

  const db = getDb();
  const found = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.id, id))
    .limit(1);
  const item = found[0];
  if (!item) return;

  // De beheerder mag alles verwijderen. Een gewone bezoeker enkel zijn eigen
  // broodje (cookie-token komt overeen) én zolang de bestelling nog open is.
  if (!(await isAdmin())) {
    const token = await getOwnerToken();
    const owns = !!token && !!item.ownerToken && token === item.ownerToken;
    if (!owns) return;

    const ord = await db
      .select({ status: groupOrders.status })
      .from(groupOrders)
      .where(eq(groupOrders.id, item.groupOrderId))
      .limit(1);
    if (ord[0]?.status !== "open") return;
  }

  await db.delete(orderItems).where(eq(orderItems.id, id));
  revalidatePath(`/bestelling/${item.groupOrderId}`);
}

export async function renameGroupOrder(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/login");

  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!id || !name || name.length > 100) return;

  await getDb()
    .update(groupOrders)
    .set({ name })
    .where(eq(groupOrders.id, id));

  revalidatePath(`/bestelling/${id}`);
  revalidatePath("/");
}

export async function setDeadline(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/login");

  const id = text(formData, "id");
  if (!id) return;

  // Leeg = deadline wissen. Anders een ISO-tijdstip (de client rekent de lokale
  // datum/tijd om naar UTC vóór het versturen).
  const raw = text(formData, "deadline");
  let deadline: Date | null = null;
  if (raw) {
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return;
    deadline = parsed;
  }

  await getDb()
    .update(groupOrders)
    .set({ deadline })
    .where(eq(groupOrders.id, id));

  revalidatePath(`/bestelling/${id}`);
  revalidatePath("/");
}

export async function setOrderStatus(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/login");

  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id || (status !== "open" && status !== "closed")) return;

  await getDb()
    .update(groupOrders)
    .set({ status })
    .where(eq(groupOrders.id, id));

  revalidatePath(`/bestelling/${id}`);
  revalidatePath("/");
}

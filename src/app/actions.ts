"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import { getDb } from "@/db";
import { groupOrders, orderItems } from "@/db/schema";
import { getMenu, getMenuItem } from "@/data/menus";

// Leesbare ids zonder dubbelzinnige tekens (geen 0/o/1/l).
const alphabet = "23456789abcdefghijkmnopqrstuvwxyz";
const newOrderId = customAlphabet(alphabet, 8);
const newItemId = customAlphabet(alphabet, 16);

export type FormState = { ok: boolean; error?: string } | null;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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

  await db.insert(orderItems).values({
    id: newItemId(),
    groupOrderId,
    personName,
    menuItemId,
    itemName: menuItem.name,
    comment: comment || null,
  });

  revalidatePath(`/bestelling/${groupOrderId}`);
  return { ok: true };
}

export async function deleteOrderItem(formData: FormData): Promise<void> {
  const id = text(formData, "id");
  const groupOrderId = text(formData, "groupOrderId");
  if (!id) return;

  await getDb().delete(orderItems).where(eq(orderItems.id, id));

  if (groupOrderId) revalidatePath(`/bestelling/${groupOrderId}`);
}

export async function setOrderStatus(formData: FormData): Promise<void> {
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

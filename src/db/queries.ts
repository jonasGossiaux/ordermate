import "server-only";

import { connection } from "next/server";
import { asc, desc, eq, sql } from "drizzle-orm";

import { getDb } from "./index";
import { groupOrders, orderItems, type GroupOrder, type OrderItem } from "./schema";

export type GroupOrderSummary = GroupOrder & { itemCount: number };

/** Alle groepsbestellingen, nieuwste eerst, met het aantal broodjes erbij. */
export async function getRecentGroupOrders(): Promise<GroupOrderSummary[]> {
  await connection();
  const db = getDb();

  const orders = await db
    .select()
    .from(groupOrders)
    .orderBy(desc(groupOrders.createdAt));

  if (orders.length === 0) return [];

  const counts = await db
    .select({
      groupOrderId: orderItems.groupOrderId,
      count: sql<number>`count(*)::int`,
    })
    .from(orderItems)
    .groupBy(orderItems.groupOrderId);

  const countById = new Map(counts.map((row) => [row.groupOrderId, row.count]));

  return orders.map((order) => ({
    ...order,
    itemCount: countById.get(order.id) ?? 0,
  }));
}

export type GroupOrderWithItems = {
  order: GroupOrder;
  items: OrderItem[];
};

/** Eén groepsbestelling met al haar broodjes, of null als ze niet bestaat. */
export async function getGroupOrder(
  id: string,
): Promise<GroupOrderWithItems | null> {
  await connection();
  const db = getDb();

  const found = await db
    .select()
    .from(groupOrders)
    .where(eq(groupOrders.id, id))
    .limit(1);

  const order = found[0];
  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.groupOrderId, id))
    .orderBy(asc(orderItems.createdAt));

  return { order, items };
}

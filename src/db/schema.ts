import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Een groepsbestelling, bv. "Lunch and Learn broodjes".
export const groupOrders = pgTable("group_orders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // Verwijst naar een menu-id uit src/data/menus.ts (bv. "hey-tom-broodjes").
  menuId: text("menu_id").notNull(),
  // "open" of "closed". "closed" = vergrendeld door de beheerder: geen nieuwe broodjes.
  status: text("status").notNull().default("open"),
  // Optionele deadline (puur visueel). De beheerder bepaalt met de vergrendelknop
  // wanneer er echt niets meer toegevoegd kan worden.
  deadline: timestamp("deadline", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Eén regel = één broodje voor één persoon.
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  groupOrderId: text("group_order_id")
    .notNull()
    .references(() => groupOrders.id, { onDelete: "cascade" }),
  personName: text("person_name").notNull(),
  // Verwijst naar een item-id uit het menu.
  menuItemId: text("menu_item_id").notNull(),
  // Snapshot van de naam, zodat oude bestellingen leesbaar blijven
  // ook al wijzigt het menu in code.
  itemName: text("item_name").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type GroupOrder = typeof groupOrders.$inferSelect;
export type NewGroupOrder = typeof groupOrders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

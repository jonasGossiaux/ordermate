CREATE TABLE "group_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"menu_id" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"group_order_id" text NOT NULL,
	"person_name" text NOT NULL,
	"menu_item_id" text NOT NULL,
	"item_name" text NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_group_order_id_group_orders_id_fk" FOREIGN KEY ("group_order_id") REFERENCES "public"."group_orders"("id") ON DELETE cascade ON UPDATE no action;
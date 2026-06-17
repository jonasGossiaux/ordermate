import Link from "next/link";
import { notFound } from "next/navigation";

import { getGroupOrder } from "@/db/queries";
import { getMenu } from "@/data/menus";
import { setOrderStatus } from "@/app/actions";
import { AddItemForm } from "@/components/AddItemForm";
import { MenuReference } from "@/components/MenuReference";
import { OrderItemsList } from "@/components/OrderItemsList";
import { OrderSummary } from "@/components/OrderSummary";
import { ShareLink } from "@/components/ShareLink";
import { StatusBadge } from "@/components/StatusBadge";
import { RefreshButton } from "@/components/RefreshButton";
import { formatDateNL } from "@/lib/format";

const card = "rounded-2xl border border-line bg-white p-5 shadow-sm";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getGroupOrder(id);
  if (!data) notFound();

  const { order, items } = data;
  const menu = getMenu(order.menuId);
  const canEdit = order.status === "open";

  return (
    <div className="space-y-5">
      <Link href="/" className="text-sm text-slate-500 hover:text-navy">
        ← Alle bestellingen
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-navy">{order.name}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {menu?.name ?? order.menuId} · {formatDateNL(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <ShareLink />

      {canEdit && menu ? (
        <section className={card}>
          <h2 className="mb-4 text-base font-semibold">
            Jouw bestelling toevoegen
          </h2>
          <AddItemForm groupOrderId={order.id} categories={menu.categories} />
        </section>
      ) : (
        <div className="rounded-2xl border border-line bg-white p-4 text-sm text-slate-500">
          Deze bestelling is gesloten. Er kunnen geen broodjes meer worden
          toegevoegd.
        </div>
      )}

      {menu ? <MenuReference menu={menu} /> : null}

      <section className={card}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">
            Bestellingen ({items.length})
          </h2>
          <RefreshButton />
        </div>
        <OrderItemsList
          groupOrderId={order.id}
          items={items}
          canEdit={canEdit}
        />
      </section>

      <section className={card}>
        <OrderSummary
          items={items}
          title={order.name}
          menuName={menu?.name ?? order.menuId}
        />
      </section>

      <form action={setOrderStatus} className="pt-1">
        <input type="hidden" name="id" value={order.id} />
        <input type="hidden" name="status" value={canEdit ? "closed" : "open"} />
        <button
          type="submit"
          className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-slate-50"
        >
          {canEdit ? "Bestelling sluiten" : "Bestelling heropenen"}
        </button>
      </form>
    </div>
  );
}

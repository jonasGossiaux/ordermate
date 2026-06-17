import Link from "next/link";
import { notFound } from "next/navigation";

import { getGroupOrder } from "@/db/queries";
import { getMenu } from "@/data/menus";
import { renameGroupOrder, setOrderStatus } from "@/app/actions";
import { isAdmin } from "@/lib/auth";
import { getOwnerToken } from "@/lib/owner";
import { AddItemForm } from "@/components/AddItemForm";
import { Deadline } from "@/components/Deadline";
import { DeadlineEditor } from "@/components/DeadlineEditor";
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
  const [data, admin, visitorToken] = await Promise.all([
    getGroupOrder(id),
    isAdmin(),
    getOwnerToken(),
  ]);
  if (!data) notFound();

  const { order, items } = data;
  const menu = getMenu(order.menuId);
  const canAdd = order.status === "open";
  const deadlineMs = order.deadline ? order.deadline.getTime() : null;

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
          {admin ? (
            <details className="group mt-1.5">
              <summary className="inline-flex cursor-pointer list-none text-sm text-slate-500 hover:text-navy [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">✎ Naam bewerken</span>
                <span className="hidden group-open:inline">Annuleren</span>
              </summary>
              <form
                action={renameGroupOrder}
                className="mt-2 flex flex-wrap items-center gap-2"
              >
                <input type="hidden" name="id" value={order.id} />
                <input
                  name="name"
                  required
                  maxLength={100}
                  defaultValue={order.name}
                  className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-[15px] outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-soft"
                >
                  Opslaan
                </button>
              </form>
            </details>
          ) : null}
        </div>
        <StatusBadge status={order.status} />
      </div>

      <ShareLink />

      {deadlineMs != null ? <Deadline deadlineMs={deadlineMs} /> : null}

      {canAdd && menu ? (
        <section className={card}>
          <h2 className="mb-4 text-base font-semibold">
            Jouw bestelling toevoegen
          </h2>
          <AddItemForm groupOrderId={order.id} categories={menu.categories} />
        </section>
      ) : (
        <div className="rounded-2xl border border-line bg-white p-4 text-sm text-slate-500">
          Deze bestelling is vergrendeld door de beheerder. Er kunnen geen
          broodjes meer worden toegevoegd.
        </div>
      )}

      {admin ? (
        <section className={`${card} space-y-5`}>
          <h2 className="text-base font-semibold">Beheer</h2>

          <div>
            <h3 className="text-sm font-semibold text-slate-700">
              Deadline (optioneel)
            </h3>
            <DeadlineEditor id={order.id} deadlineMs={deadlineMs} />
          </div>

          <div className="border-t border-line pt-4">
            <h3 className="text-sm font-semibold text-slate-700">
              {canAdd ? "Bestellen stoppen" : "Bestellen heropenen"}
            </h3>
            <p className="mt-1 mb-2 text-xs text-slate-500">
              {canAdd
                ? "Vergrendel de bestelling zodat niemand nog broodjes kan toevoegen."
                : "Ontgrendel de bestelling zodat collega's opnieuw broodjes kunnen toevoegen."}
            </p>
            <form action={setOrderStatus}>
              <input type="hidden" name="id" value={order.id} />
              <input
                type="hidden"
                name="status"
                value={canAdd ? "closed" : "open"}
              />
              <button
                type="submit"
                className={
                  canAdd
                    ? "rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-soft"
                    : "rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-slate-50"
                }
              >
                {canAdd ? "🔒 Bestelling vergrendelen" : "🔓 Bestelling ontgrendelen"}
              </button>
            </form>
          </div>
        </section>
      ) : null}

      {menu ? <MenuReference menu={menu} /> : null}

      <section className={card}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">
            Bestellingen ({items.length})
          </h2>
          <RefreshButton />
        </div>
        <OrderItemsList
          items={items}
          admin={admin}
          visitorToken={visitorToken}
          locked={!canAdd}
        />
      </section>

      <section className={card}>
        <OrderSummary
          items={items}
          title={order.name}
          menuName={menu?.name ?? order.menuId}
        />
      </section>
    </div>
  );
}

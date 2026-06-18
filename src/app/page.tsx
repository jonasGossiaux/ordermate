import Link from "next/link";

import { getRecentGroupOrders } from "@/db/queries";
import { getMenu } from "@/data/menus";
import { Deadline } from "@/components/Deadline";
import { StatusBadge } from "@/components/StatusBadge";

export default async function HomePage() {
  const orders = await getRecentGroupOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Bestellingen</h1>
          <p className="text-sm text-slate-500">
            Maak een groepsbestelling en deel de link met je collega&apos;s.
          </p>
        </div>
        <Link
          href="/nieuw"
          className="rounded-lg bg-navy px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-navy-soft"
        >
          + Nieuwe bestelling
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-medium">Nog geen bestellingen.</p>
          <p className="mt-1 text-sm text-slate-500">
            Klik op &quot;Nieuwe bestelling&quot; om er een te starten.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => {
            const menu = getMenu(order.menuId);
            return (
              <li key={order.id}>
                <Link
                  href={`/bestelling/${order.id}`}
                  className="block rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-navy/30 hover:shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-navy">
                        {order.name}
                      </div>
                      <div className="mt-0.5 text-sm text-slate-500">
                        {menu?.name ?? order.menuId} ·{" "}
                        {order.itemCount}{" "}
                        {order.itemCount === 1 ? "broodje" : "broodjes"}
                      </div>
                      {order.deadline ? (
                        <div className="mt-1 text-xs">
                          <Deadline
                            deadlineMs={order.deadline.getTime()}
                            compact
                          />
                        </div>
                      ) : null}
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

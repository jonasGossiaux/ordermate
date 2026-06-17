import { deleteOrderItem } from "@/app/actions";
import type { OrderItem } from "@/db/schema";

export function OrderItemsList({
  items,
  admin,
  visitorToken,
  locked,
}: {
  items: OrderItem[];
  admin: boolean;
  visitorToken: string | null;
  locked: boolean;
}) {
  if (items.length === 0) {
    return (
      <p className="py-2 text-sm text-slate-500">
        Nog geen bestellingen. Wees de eerste!
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line">
      {items.map((item) => {
        const mine = !!visitorToken && item.ownerToken === visitorToken;
        // Beheerder mag altijd; eigenaar enkel zolang de bestelling open is.
        const canDelete = admin || (mine && !locked);

        return (
          <li key={item.id} className="flex items-start gap-3 py-3">
            <span className="min-w-[72px] shrink-0 font-semibold text-navy">
              {item.personName}
              {mine ? (
                <span className="ml-1.5 rounded-full bg-navy/10 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-navy">
                  jij
                </span>
              ) : null}
            </span>
            <div className="flex-1">
              <div className="font-medium">{item.itemName}</div>
              {item.comment && (
                <div className="text-sm text-slate-500">{item.comment}</div>
              )}
            </div>
            {canDelete && (
              <form action={deleteOrderItem}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  aria-label={`Verwijder ${item.itemName} van ${item.personName}`}
                  title={admin ? "Verwijderen" : "Jouw broodje verwijderen"}
                  className="rounded-md px-2 text-lg leading-none text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  ×
                </button>
              </form>
            )}
          </li>
        );
      })}
    </ul>
  );
}

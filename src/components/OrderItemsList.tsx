import { deleteOrderItem } from "@/app/actions";
import type { OrderItem } from "@/db/schema";

export function OrderItemsList({
  groupOrderId,
  items,
  canEdit,
}: {
  groupOrderId: string;
  items: OrderItem[];
  canEdit: boolean;
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
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3 py-3">
          <span className="min-w-[72px] shrink-0 font-semibold text-navy">
            {item.personName}
          </span>
          <div className="flex-1">
            <div className="font-medium">{item.itemName}</div>
            {item.comment && (
              <div className="text-sm text-slate-500">{item.comment}</div>
            )}
          </div>
          {canEdit && (
            <form action={deleteOrderItem}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="groupOrderId" value={groupOrderId} />
              <button
                type="submit"
                aria-label={`Verwijder ${item.itemName} van ${item.personName}`}
                title="Verwijderen"
                className="rounded-md px-2 text-lg leading-none text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                ×
              </button>
            </form>
          )}
        </li>
      ))}
    </ul>
  );
}

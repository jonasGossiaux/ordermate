import Link from "next/link";

import { menus } from "@/data/menus";
import { CreateOrderForm } from "@/components/CreateOrderForm";

export default function NewOrderPage() {
  const menuOptions = menus.map((menu) => ({ id: menu.id, name: menu.name }));

  return (
    <div className="space-y-5">
      <Link href="/" className="text-sm text-slate-500 hover:text-navy">
        ← Terug
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-navy">Nieuwe bestelling</h1>
        <p className="text-sm text-slate-500">
          Geef je groepsbestelling een naam en kies een menu.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <CreateOrderForm menus={menuOptions} />
      </div>
    </div>
  );
}

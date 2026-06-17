import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
      <h1 className="text-xl font-bold text-navy">Niet gevonden</h1>
      <p className="mt-1 text-sm text-slate-500">
        Deze bestelling bestaat niet (meer).
      </p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-soft"
      >
        Naar alle bestellingen
      </Link>
    </div>
  );
}

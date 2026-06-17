# OrderMate

Een lichte webapp om samen met collega's te bestellen, bv. broodjes voor een
"Lunch & Learn". Je maakt een groepsbestelling aan, deelt de link, en iedereen
kiest zijn broodje met een eventuele opmerking ("geen groentjes"). Daarna zie je
één duidelijke samenvatting die je kan overnemen op de website van de winkel.

Gebouwd met **Next.js (App Router)**, **Tailwind CSS**, **Drizzle ORM** en
**Neon Postgres**, gehost op **Vercel**.

## De menukaart aanpassen

Alle gerechten staan in code in [`src/data/menus.ts`](./src/data/menus.ts).
Een broodje toevoegen of wijzigen = dit bestand aanpassen, committen en pushen.
Vercel deployt automatisch.

Een nieuw soort menu (bv. pizza of pasta) voeg je toe als extra object in de
`menus`-array. Bij het aanmaken van een bestelling kan je dan dat menu kiezen.

> Wijzig nooit de `id` van een bestaand item zodra het in gebruik is — die wordt
> opgeslagen bij bestellingen. De getoonde naam wordt wel als snapshot bewaard.

## Lokaal ontwikkelen

```bash
npm install
npm run dev
```

De app draait op http://localhost:3000. Voor data heb je een Postgres-database
nodig. Kopieer `.env.example` naar `.env.local` en vul `DATABASE_URL` in
(bv. een gratis database van [Neon](https://neon.tech)), en maak de tabellen aan:

```bash
npm run db:migrate
```

> Zonder `DATABASE_URL` werkt `npm run build` nog steeds (de databaseverbinding
> wordt pas bij de eerste query gelegd), maar pagina's met data geven een fout
> tot er een database is gekoppeld.

## Deployen op Vercel

1. Push deze repo naar GitHub.
2. Importeer de repo op [vercel.com/new](https://vercel.com/new) en autoriseer GitHub.
3. Open in het Vercel-project het tabblad **Storage** → **Create Database** →
   **Neon Postgres** (gratis). Vercel voegt automatisch `DATABASE_URL` toe.
4. Deploy. De build voert eerst de migraties uit (`scripts/db-migrate.mjs`) en
   maakt zo de tabellen aan, daarna draait `next build`.

Elke volgende `git push` (ook nieuwe broodjes in `src/data/menus.ts`) wordt
automatisch gedeployd.

## Handige scripts

| Script              | Doel                                            |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Lokale ontwikkelserver                          |
| `npm run build`     | Migraties (indien `DATABASE_URL`) + productiebuild |
| `npm run db:generate` | Genereer SQL-migratie uit het schema          |
| `npm run db:migrate`  | Voer migraties uit op de database             |
| `npm run db:studio`   | Open Drizzle Studio om de data te bekijken    |

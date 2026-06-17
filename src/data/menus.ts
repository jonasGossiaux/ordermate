// Menukaarten staan in code. Een nieuw broodje toevoegen = dit bestand aanpassen,
// committen en pushen -> Vercel deployt automatisch.
//
// In de toekomst kan je hier extra menu's toevoegen (bv. pizza's of pasta's)
// door een nieuw `Menu`-object aan de `menus`-array toe te voegen.

export type MenuItem = {
  /** Stabiele, URL-vriendelijke id. Wijzig deze niet meer eens hij in gebruik is. */
  id: string;
  name: string;
  description?: string;
  /** Toon een "NIEUW"-label. */
  isNew?: boolean;
  /** Tijdelijk niet beschikbaar; kan niet besteld worden. */
  soldOut?: boolean;
  /** Extra opmerking, bv. "Enkel op vrijdag". */
  note?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type Menu = {
  id: string;
  name: string;
  categories: MenuCategory[];
};

export const menus: Menu[] = [
  {
    id: "hey-tom-broodjes",
    name: "Hey Tom Broodjes",
    categories: [
      {
        id: "kaas",
        name: "Broodjes met kaas",
        items: [
          {
            id: "kaas-cressonette",
            name: "Kaas Cressonette",
            description: "Jonge kaas, mayo, ei, tomaat en cressonette",
            isNew: true,
          },
          {
            id: "broodje-kaas",
            name: "Broodje Kaas",
            description: "Jonge kaas, boter of mayo (geen groentjes)",
          },
          {
            id: "broodje-kaas-plus",
            name: "Broodje Kaas +",
            description: "Jonge kaas, mayonaise, groenten",
          },
          {
            id: "broodje-kaas-mayo-ei",
            name: "Broodje Kaas Mayo Ei",
            description: "Jonge kaas, mayonaise, ei (geen groentjes)",
          },
          {
            id: "broodje-kaas-tropical",
            name: "Broodje Kaas Tropical",
            description: "Jonge kaas, cocktailsaus, ananas, wortel",
          },
          {
            id: "broodje-brie-boter",
            name: "Broodje Brie Boter",
            description: "Franse Brie, boter of mayo",
          },
          {
            id: "broodje-brie-plus",
            name: "Broodje Brie Plus",
            description: "Franse Brie, sla, tomaat",
          },
          {
            id: "broodje-brie-spek",
            name: "Broodje Brie Spek",
            description: "Franse Brie, honing, spek, appel",
          },
          {
            id: "broodje-brie-maison",
            name: "Broodje Brie Maison",
            description: "Franse Brie, sla, honing, veenbessen",
          },
          {
            id: "broodje-brie-italiaanse-ham",
            name: "Broodje Brie Italiaanse Ham",
            description: "Franse Brie, italiaanse ham, sla, honing",
          },
          {
            id: "broodje-geitenkaas-speciaal",
            name: "Broodje Geitenkaas Speciaal",
            description: "Geitenkaas, sla, honing, veenbessen",
          },
          {
            id: "broodje-geitenkaas",
            name: "Broodje Geitenkaas",
            description: "Geitenkaas, sla, tomaat",
          },
        ],
      },
      {
        id: "vlees",
        name: "Broodjes met vlees",
        items: [
          {
            id: "broodje-ham-boter",
            name: "Broodje Ham Boter",
            description: "Gekookte ham en boter of mayo (geen groentjes)",
          },
          {
            id: "broodje-ham-plus",
            name: "Broodje Ham +",
            description: "Gekookte ham, mayonaise, groenten",
          },
          {
            id: "broodje-bacon-pepper",
            name: "Broodje Bacon Pepper",
            description: "Gekookte ham, pepersaus, tomaat, sla",
          },
          {
            id: "broodje-ham-cressonette",
            name: "Broodje Ham Cressonette",
            description: "Gekookte ham, mayonnaise, tomaat, ei, cressonette",
          },
          {
            id: "broodje-ham-kaas-boter",
            name: "Broodje Ham Kaas Boter of mayo",
            description: "Gekookte ham en kaas en mayo of boter (geen groentjes)",
          },
          {
            id: "broodje-ham-kaas-ei",
            name: "Broodje Ham Kaas Ei",
            description: "Gekookte ham, kaas, mayo, ei",
          },
          {
            id: "club-smos-kaas-ham",
            name: "Club (smos kaas-ham)",
            description:
              "Gekookte ham, kaas, mayonaise, sla, ei, tomaat en wortel",
          },
          {
            id: "broodje-club-speciaal",
            name: "Broodje Club Speciaal",
            description: "Gekookte ham, kaas, cocktail, sla, tomaat",
          },
          {
            id: "broodje-club-cressonette",
            name: "Broodje Club Cressonette",
            description: "Gekookte ham, kaas, mayonaise, tomaat, ei en cressonette",
          },
          {
            id: "broodje-club-prima-donna",
            name: "Broodje Club Prima Donna",
            description:
              "Jonge kaas, italiaanse ham, hannibalsaus, sla, ei, tomaat en gedroogde ui",
          },
          {
            id: "broodje-club-caramba",
            name: "Broodje Club Caramba",
            description:
              "Gekookte ham, kaas, spicy hannibal, sla, ei, wortel en gedroogde ui",
          },
          {
            id: "broodje-saint-tropez",
            name: "Broodje Saint-Tropez",
            description: "Jonge kaas, ham, cocktailsaus, sla, ananas en wortel",
          },
          {
            id: "broodje-salami-boter",
            name: "Broodje Salami Boter",
            description: "Salami en boter of mayo (geen groentjes)",
          },
          {
            id: "broodje-salami-plus",
            name: "Broodje Salami Plus",
            description: "Salami, boter, sla, ei, tomaat",
          },
          {
            id: "broodje-salami-special",
            name: "Broodje Salami Special",
            description: "Salami, kaas, mayonaise, sla, ei, tomaat",
          },
          {
            id: "broodje-trio-mio",
            name: "Broodje Trio Mio",
            description: "Salami, ham, kaas, mayonaise, sla, ei, tomaat",
          },
          {
            id: "broodje-prepare",
            name: "Broodje Prepare",
            description: "Prepare (geen groentjes)",
          },
          {
            id: "broodje-prepare-plus",
            name: "Broodje Prepare Plus",
            description: "Prepare, sla, ei, tomaat",
          },
          {
            id: "broodje-prepare-speciaal",
            name: "Broodje Prepare Speciaal",
            description: "Prepare, kaas, sla en tomaat",
          },
          {
            id: "broodje-martino",
            name: "Broodje Martino",
            description: "Préparé, martinosaus, augurk en tomaat",
          },
          {
            id: "broodje-americana",
            name: "Broodje Americana",
            description: "Préparé, spicy hannibal, augurk en gedroogde uitjes",
          },
          {
            id: "broodje-martino-speciaal",
            name: "Broodje Martino Speciaal",
            description:
              "Préparé, martinosaus, sla, tomaat, augurk, ajuin (ansjovis op verzoek +0,20 cent)",
          },
          {
            id: "broodje-mozzarella-italiaan",
            name: "Broodje Mozzarella Italiaan",
            description: "Italiaanse ham, mozzarella, pesto, tomaat, sla",
          },
          {
            id: "broodje-grote-honger",
            name: "Broodje Grote Honger",
            description: "Gebakken gehakt, hannibalsaus, sla, tomaat en gedroogde ui",
          },
          {
            id: "broodje-baguette-boulet",
            name: "Broodje Baguette Boulet",
            description:
              "Artisanale boulet, sla, tomaat, hannibalsaus en gedroogde ui",
          },
          {
            id: "broodje-reuze-honger",
            name: "Broodje Reuze Honger",
            description: "Ham, kaas, pepersalami, kip, mayonaise, sla en tomaat",
          },
          {
            id: "broodje-italiaanse-ham-plus",
            name: "Broodje Italiaanse Ham Plus",
            description: "Italiaanse ham, sla en tomaat",
          },
          {
            id: "broodje-italiaanse-ham-boter",
            name: "Broodje Italiaanse Ham Boter",
            description: "Italiaanse ham en boter (geen groentjes)",
          },
          {
            id: "broodje-italienne",
            name: "Broodje Italienne",
            description: "Italiaanse ham, geitenkaas, honing, sla, nootjes",
          },
          {
            id: "broodje-gehakt",
            name: "Broodje Gehakt",
            description: "Gehakt, sla, tomaat en ajuin",
            soldOut: true,
            note: "Enkel op vrijdag — terug vanaf september",
          },
          {
            id: "martino-bis",
            name: "Martino BIS",
            description: "Préparé, martinosaus, mosterd, augurk en ansjovis",
            isNew: true,
          },
        ],
      },
      {
        id: "vis",
        name: "Broodjes met vis",
        items: [
          {
            id: "broodje-krabsalade",
            name: "Broodje Krabsalade",
            description: "Krabsalade, sla, ei, tomaat",
          },
          {
            id: "broodje-krab-hawai",
            name: "Broodje Krab Hawai",
            description: "Krabsalade, ananas en wortel",
          },
          {
            id: "broodje-tonatino",
            name: "Broodje Tonatino",
            description: "Tonijn, pikante saus, sla, ei en tomaat",
          },
          {
            id: "broodje-tonijnsalade",
            name: "Broodje Tonijnsalade",
            description: "Tonijnsalade, sla, ei, tomaat",
          },
          {
            id: "broodje-tonijn-speciaal",
            name: "Broodje Tonijn Speciaal",
            description:
              "Tonijnsalade, pikante saus, sla, tomaat, augurk, ui (ansjovis op verzoek)",
          },
          {
            id: "broodje-zalmsalade",
            name: "Broodje Zalmsalade",
            description: "Zalmsalade, sla, ei, tomaat",
          },
          {
            id: "broodje-garnaalsalade",
            name: "Broodje Garnaalsalade",
            description: "Garnaalsalade, sla, ei, tomaat",
          },
          {
            id: "broodje-gerookte-zalm",
            name: "Broodje Gerookte Zalm",
            description: "Gerookte zalm, tomaat en sla",
          },
          {
            id: "broodje-finesse",
            name: "Broodje Finesse",
            description: "Gerookte zalm, kruidenkaas, tomaat en sla",
          },
          {
            id: "salmon-caprese",
            name: "Salmon Caprese",
            description: "Gerookte zalm, pesto, mozzarella, tomaat, sla",
          },
        ],
      },
      {
        id: "kip",
        name: "Broodjes met kip",
        items: [
          {
            id: "kip-club",
            name: "Kip Club",
            description: "Kipfilet, kaas, mayo, sla, ei, tomaat en wortel",
            isNew: true,
          },
          {
            id: "kip-avocado",
            name: "Kip Avocado",
            description: "Kipfilet, avocado, licht pikant rood sausje, ei en tomaat",
            isNew: true,
          },
          {
            id: "broodje-kip-curry",
            name: "Broodje Kip Curry",
            description: "Kip curry, sla, ei, tomaat",
          },
          {
            id: "broodje-kip-mayonaise",
            name: "Broodje Kip Mayonaise",
            description: "Kip mayonaise, sla, ei, tomaat",
          },
          {
            id: "broodje-kip-curry-special",
            name: "Broodje Kip Curry Special",
            description: "Kip curry, ananas en wortel",
          },
          {
            id: "broodje-kip-spek",
            name: "Broodje Kip Spek",
            description: "Kip, mayonaise, sla, tomaat, spek, gedroogde ui",
          },
          {
            id: "broodje-kip-appel",
            name: "Broodje Kip Appel",
            description: "Kip, sla, tomaat, honing en appel",
          },
          {
            id: "broodje-kip-fit",
            name: "Broodje Kip Fit",
            description: "Kip, sla, ei, tomaat en wortel",
          },
          {
            id: "broodje-kip-tropical",
            name: "Broodje Kip Tropical",
            description: "Kipfilet, cocktailsaus, ananas, wortel",
          },
          {
            id: "broodje-sweet-chicken",
            name: "Broodje Sweet Chicken",
            description: "Kipfilet, spicy hannibal, augurk, tomaat, gedroogde uitjes",
          },
          {
            id: "broodje-kip-mozzarella",
            name: "Broodje Kip Mozzarella",
            description: "Kip, mozzarella, tomaat, pesto, gemarineerd tomaatje, sla",
          },
          {
            id: "broodje-kip-caesar",
            name: "Broodje Kip Caesar",
            description: "Kip, sla, tomaat, parmezaanse kaas, dressing en croutons",
          },
        ],
      },
      {
        id: "veggie",
        name: "Vegetarisch, vegan en halal",
        items: [
          {
            id: "avocado-vegan",
            name: "Avocado (vegan)",
            description: "Avocado, tomaat, sla, wortel",
            isNew: true,
          },
          {
            id: "hummus-vegan",
            name: "Hummus (vegan)",
            description: "Hummus, licht pikant sausje, sla, tomaat, wortel",
            isNew: true,
          },
          {
            id: "broodje-gezond",
            name: "Broodje Gezond",
            description: "Sla, tomaat, ei, wortel, mayo",
          },
          {
            id: "broodje-mona-liesa",
            name: "Broodje Mona Liesa",
            description: "Mozzarella, sla, pesto, tomaat",
          },
          {
            id: "broodje-caprese",
            name: "Broodje Caprese",
            description: "Mozzarella, parmezaanse kaas, tomaat, sla, dressing",
          },
          {
            id: "broodje-avocado-egg",
            name: "Broodje Avocado Egg",
            description: "Avocado, ei, tomaat, pijnboompitjes en balsamico",
          },
          {
            id: "broodje-hummus-pesto",
            name: "Broodje Hummus Pesto",
            description: "Hummus, pesto, sla, tomaat, wortel",
          },
          {
            id: "bagnat-kikkererwt",
            name: "Bagnat Kikkererwt",
            description:
              "Hummus, kikkererwt, pikant sausje, sla, tomaat en wortel op pain bagnat",
          },
          {
            id: "italiaanse-wrap",
            name: "Italiaanse Wrap",
            description: "Mozzarella, pesto, sla, tomaatjes en wortel",
          },
          {
            id: "chatar-halal",
            name: "Chatar (halal)",
            description: "Pikante chatar, mayo, sla, tomaat",
            isNew: true,
          },
          {
            id: "chatar-smos-halal",
            name: "Chatar Smos (halal)",
            description: "Pikante chatar, kaas, mayo, sla, tomaat, wortel",
            isNew: true,
          },
          {
            id: "chatar-speciaal",
            name: "Chatar Speciaal (halal)",
            description:
              "Pikante chatar, kaas, hannibalsaus, gedroogde uitjes, sla, tomaat, wortel",
            isNew: true,
          },
          {
            id: "vic",
            name: "VIC",
            description: "Hummus, avocado, balsamico en tomaat",
          },
        ],
      },
    ],
  },
];

export function getMenu(menuId: string): Menu | undefined {
  return menus.find((menu) => menu.id === menuId);
}

export function getMenuItem(
  menuId: string,
  itemId: string,
): MenuItem | undefined {
  const menu = getMenu(menuId);
  if (!menu) return undefined;
  for (const category of menu.categories) {
    const item = category.items.find((entry) => entry.id === itemId);
    if (item) return item;
  }
  return undefined;
}

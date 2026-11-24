/**
 * Starting prices (GBP). Single source for the /prices page, the services
 * menu, the /services price grid and each service page's price cards.
 */
export const PRICES = {
  endOfTenancy: 110,
  deepCleaning: 105,
  oven: 35,
  fridgeFreezer: 25,
  washingMachine: 15,
  microwave: 12,
  sofa: 20,
  curtain: 25,
  driveway: 65,
  balcony: 45,
} as const;

export type PriceItem = { item: string; from: number; href?: string };

export const priceGroups: readonly { title: string; description: string; items: readonly PriceItem[] }[] = [
  {
    title: "Property cleaning",
    description: "Whole-property cleans for move-outs, move-ins and resets.",
    items: [
      { item: "End of tenancy cleaning", from: PRICES.endOfTenancy, href: "/services/end-of-tenancy-cleaning" },
      { item: "Deep cleaning", from: PRICES.deepCleaning, href: "/services/deep-move-cleaning" },
    ],
  },
  {
    title: "Kitchen appliances",
    description: "Book on their own or add to any clean.",
    items: [
      { item: "Oven cleaning", from: PRICES.oven, href: "/services/oven-cleaning" },
      { item: "Fridge / freezer cleaning", from: PRICES.fridgeFreezer, href: "/services/fridge-freezer-cleaning" },
      { item: "Washing machine cleaning", from: PRICES.washingMachine, href: "/services/washing-machine-cleaning" },
      { item: "Microwave cleaning", from: PRICES.microwave, href: "/services/microwave-cleaning" },
    ],
  },
  {
    title: "Sofas, curtains & outdoor",
    description: "Soft furnishings and jet washing.",
    items: [
      { item: "Sofa cleaning", from: PRICES.sofa, href: "/services/carpet-upholstery-cleaning" },
      { item: "Curtain cleaning", from: PRICES.curtain, href: "/services/carpet-upholstery-cleaning" },
      { item: "Driveway jet washing", from: PRICES.driveway, href: "/services/jet-washing" },
      { item: "Balcony cleaning", from: PRICES.balcony, href: "/services/jet-washing" },
    ],
  },
];

/** Services priced individually after a short assessment. */
export const quotedServices: readonly PriceItem[] = [
  { item: "Airbnb & housekeeping", from: 0, href: "/services/bnb-housekeeping" },
  { item: "Commercial & office cleaning", from: 0, href: "/services/commercial-office-cleaning" },
  { item: "After-builders cleaning", from: 0, href: "/services/after-builders-cleaning" },
  { item: "Carpet & rug cleaning", from: 0, href: "/services/carpet-upholstery-cleaning" },
];

export const allPrices = priceGroups.flatMap((group) => group.items);
export const lowestPrice = Math.min(...allPrices.map((price) => price.from));

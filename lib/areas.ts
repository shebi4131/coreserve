export type ServiceArea = {
  slug: string;
  name: string;
  region: string;
  eyebrow: string;
  summary: string;
  introduction: string;
  locations: readonly { name: string; postcode: string }[];
  postcodeAreas: readonly string[];
  postcodeExamples: readonly string[];
  highlights: readonly string[];
  faqs: readonly { question: string; answer: string }[];
};

export const serviceAreas: readonly ServiceArea[] = [
  {
    slug: "preston",
    name: "Preston",
    region: "Lancashire",
    eyebrow: "Preston and Lancashire coverage",
    summary: "Professional cleaning for homes, landlords, agents and workplaces in Preston and nearby Lancashire towns.",
    introduction: "We coordinate Preston enquiries around the property, access, required date and the right team for the job. From one-off domestic cleans to planned commercial work, the scope and availability are confirmed before booking.",
    locations: [
      { name: "Preston city centre", postcode: "PR1" }, { name: "Fulwood", postcode: "PR2" },
      { name: "Ribbleton", postcode: "PR2" }, { name: "Penwortham", postcode: "PR1" },
      { name: "Bamber Bridge", postcode: "PR5" }, { name: "Walton-le-Dale", postcode: "PR5" },
      { name: "Lostock Hall", postcode: "PR5" }, { name: "Leyland", postcode: "PR25" },
      { name: "Chorley", postcode: "PR7" }, { name: "Longridge", postcode: "PR3" },
      { name: "Burnley", postcode: "BB10" }, { name: "Padiham", postcode: "BB12" },
      { name: "Nelson", postcode: "BB9" }, { name: "Colne", postcode: "BB8" },
      { name: "Accrington", postcode: "BB5" }, { name: "Blackburn", postcode: "BB1" },
      { name: "Darwen", postcode: "BB3" }, { name: "Clitheroe", postcode: "BB7" },
      { name: "Rossendale", postcode: "BB4" }, { name: "Blackpool", postcode: "FY1" },
      { name: "Lytham St Annes", postcode: "FY8" }, { name: "Fleetwood", postcode: "FY7" },
      { name: "Lancaster", postcode: "LA1" }, { name: "Morecambe", postcode: "LA4" },
    ],
    postcodeAreas: ["PR", "BB", "FY", "LA"],
    postcodeExamples: ["PR1", "PR2", "PR5", "PR7", "PR25", "BB1", "BB10", "BB11", "FY1", "LA1"],
    highlights: ["Preston and nearby Lancashire towns", "Domestic and commercial cleaning", "One-off and repeat enquiries"],
    faqs: [
      { question: "Which parts of Preston do you cover?", answer: "We consider enquiries across Preston, Fulwood, Penwortham, Leyland, Chorley, Burnley, Blackburn, Blackpool, Lancaster and surrounding Lancashire towns (PR, BB, FY and LA postcodes). Share the full postcode so travel and availability can be confirmed for your date." },
      { question: "Can I arrange recurring cleaning in Preston?", answer: "Yes. Recurring domestic, office and managed-property cleaning can be discussed alongside one-off work. Frequency and tasks are agreed before booking." },
      { question: "Do you provide end-of-tenancy cleaning?", answer: "Yes. End-of-tenancy enquiries are scoped around the property size, condition, access, appliances and required handover date." },
    ],
  },
  {
    slug: "manchester",
    name: "Manchester",
    region: "Greater Manchester",
    eyebrow: "Greater Manchester coverage",
    summary: "Coordinated residential and commercial cleaning across Manchester and the wider Greater Manchester area.",
    introduction: "We assess Manchester enquiries by postcode, property type and timing. This helps us match the work to a suitable team and provide a clear scope before anything is booked.",
    locations: [
      { name: "Manchester city centre", postcode: "M1" }, { name: "Salford", postcode: "M5" },
      { name: "Trafford", postcode: "M16" }, { name: "Stockport", postcode: "SK1" },
      { name: "Oldham", postcode: "OL1" }, { name: "Rochdale", postcode: "OL11" },
      { name: "Bury", postcode: "BL9" }, { name: "Bolton", postcode: "BL1" },
      { name: "Wigan", postcode: "WN1" }, { name: "Tameside", postcode: "OL6" },
    ],
    postcodeAreas: ["M", "OL", "SK", "BL", "WN"],
    postcodeExamples: ["M1", "M2", "M3", "M15", "M20", "M30", "M50", "OL1", "SK1", "SK4"],
    highlights: ["City-centre and suburban enquiries", "Home, office and managed properties", "Availability confirmed by postcode"],
    faqs: [
      { question: "Do you cover all of Greater Manchester?", answer: "We welcome enquiries from Manchester, Salford, Trafford, Stockport and surrounding boroughs. Coverage depends on the full postcode, scope and team availability." },
      { question: "Can cleaning be arranged outside office hours?", answer: "For offices and commercial premises, share your preferred access window. Early, evening or weekend availability is confirmed as part of the quotation." },
      { question: "Can several cleaning services be combined?", answer: "Yes. Select every service you need in the enquiry form so we can review the full property scope and coordinate the visit properly." },
    ],
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    region: "Merseyside",
    eyebrow: "Merseyside coverage",
    summary: "Cleaning for homes, tenancies, offices and managed properties across Liverpool and Merseyside.",
    introduction: "Liverpool and wider Merseyside enquiries are planned around location, access and the work required. We confirm coverage before quotation so customers receive a realistic response rather than a generic promise.",
    locations: [
      { name: "Liverpool city centre", postcode: "L1" }, { name: "Bootle", postcode: "L20" },
      { name: "Crosby", postcode: "L23" }, { name: "Formby", postcode: "L37" },
      { name: "Southport", postcode: "PR8" }, { name: "Huyton", postcode: "L36" },
      { name: "Prescot", postcode: "L34" }, { name: "St Helens", postcode: "WA10" },
      { name: "Knowsley", postcode: "L34" }, { name: "Wirral", postcode: "CH41" },
    ],
    postcodeAreas: ["L", "CH", "PR", "WA"],
    postcodeExamples: ["L1", "L3", "L7", "L15", "L20", "L23", "L31", "L36", "L39", "CH41"],
    highlights: ["Liverpool and wider Merseyside", "Tenancy and property cleaning", "Clear scope before booking"],
    faqs: [
      { question: "Which Liverpool areas can I enquire about?", answer: "We consider work across Liverpool, Bootle, Crosby, Huyton, Prescot, St Helens, Wirral and surrounding locations. The full postcode is needed to confirm coverage." },
      { question: "Do you work with landlords and letting agents?", answer: "Yes. Landlords, letting agents and property managers can request end-of-tenancy, changeover, communal-area and planned cleaning." },
      { question: "How quickly will availability be confirmed?", answer: "Send the postcode, required service and preferred date. The team will review travel, access and scheduling before confirming the next step." },
    ],
  },
  {
    slug: "london",
    name: "London",
    region: "Greater London",
    eyebrow: "Greater London enquiries",
    summary: "Postcode-led cleaning enquiries for residential, commercial and managed properties across London.",
    introduction: "London enquiries are reviewed by postcode and availability. We consider the property, service mix, access and timing together before confirming whether the work can be scheduled.",
    locations: [
      { name: "Central London", postcode: "WC1" }, { name: "Westminster", postcode: "SW1" },
      { name: "Camden", postcode: "NW1" }, { name: "Islington", postcode: "N1" },
      { name: "Kensington & Chelsea", postcode: "SW3" }, { name: "Hammersmith & Fulham", postcode: "W6" },
      { name: "Lambeth", postcode: "SE11" }, { name: "Southwark", postcode: "SE1" },
      { name: "Wandsworth", postcode: "SW18" }, { name: "Croydon", postcode: "CR0" },
      { name: "Ealing", postcode: "W5" }, { name: "Greenwich", postcode: "SE10" },
      { name: "Richmond", postcode: "TW9" }, { name: "Sutton", postcode: "SM1" },
      { name: "Bromley", postcode: "BR1" },
    ],
    postcodeAreas: ["E", "EC", "N", "NW", "SE", "SW", "W", "WC", "BR", "CR", "DA", "EN", "HA", "IG", "KT", "RM", "SM", "TW", "UB", "WD"],
    postcodeExamples: ["SW1", "W1", "EC1", "E14", "N1", "NW1", "SE1", "CR0", "BR1", "SM1"],
    highlights: ["Central and Greater London enquiries", "Residential and commercial properties", "Coverage checked before quotation"],
    faqs: [
      { question: "Do you cover every London borough?", answer: "London enquiries are considered by full postcode, scope and availability. Enter the postcode or send it with your quote request so the team can confirm coverage." },
      { question: "Can I request urgent cleaning in London?", answer: "Share the required date and access details. Short-notice work may be considered, but it is always subject to postcode, scope and team availability." },
      { question: "What information should I provide for a London quote?", answer: "Include the full postcode, property type and size, selected cleaning services, preferred date and any access, parking or condition details." },
    ],
  },
] as const;

export function getServiceArea(slug: string) {
  return serviceAreas.find((area) => area.slug === slug);
}


import { Building2, KeyRound, Sparkles } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  category: "Cleaning";
  summary: string;
  audience: string;
  headline: string;
  intro: string;
  includes: readonly string[];
  preparation: readonly string[];
  process: readonly { title: string; detail: string }[];
  faqs: readonly { question: string; answer: string }[];
  icon: typeof Sparkles;
};

export const services: readonly Service[] = [
  {
    slug: "end-of-tenancy-cleaning",
    title: "End-of-tenancy cleaning",
    shortTitle: "End of tenancy",
    category: "Cleaning",
    summary: "Detailed move-out cleaning for tenants, landlords and letting agents, scoped around the property and handover requirements.",
    audience: "Tenants, landlords, letting agents and property managers",
    headline: "A clear, checklist-led clean before the keys change hands.",
    intro: "End-of-tenancy cleaning needs more detail than a routine visit. We confirm the size, condition, access, appliances and any tenancy inventory requirements before preparing an itemised quotation. The agreed checklist then guides the clean and final quality check.",
    includes: [
      "Kitchen worktops, accessible cupboards, splashbacks, sink, taps and floors",
      "Bathroom sanitaryware, showers or baths, tiles, mirrors and limescale attention",
      "Bedrooms and living areas, including accessible surfaces, skirting, doors and switches",
      "Internal windows and sills where safe and included in the agreed scope",
      "Vacuuming and mopping of suitable floor surfaces",
      "Final checklist review before completion",
    ],
    preparation: [
      "Property type, bedrooms and bathrooms",
      "Whether the property is occupied, empty or furnished",
      "Required completion or inventory date",
      "Access, parking and key arrangements",
      "Any areas needing special attention or photographs",
    ],
    process: [
      { title: "Scope", detail: "We review the property details, condition and required handover standard." },
      { title: "Quote", detail: "You receive an itemised scope with selected extras and exclusions made clear." },
      { title: "Clean", detail: "The agreed room-by-room checklist guides the visit." },
      { title: "Quality check", detail: "The team reviews the agreed work and records any approved variations." },
    ],
    faqs: [
      { question: "Are appliances automatically included?", answer: "External wiping and full internal appliance cleaning are different tasks. We confirm ovens, cookers, dishwashers, fridges and washing machines separately in the quotation so the scope is unambiguous." },
      { question: "Does the property need to be empty?", answer: "An empty property usually allows the most complete access, but furnished or partly occupied properties can be considered. Tell us the situation when requesting a quote." },
      { question: "Can carpet or upholstery work be added?", answer: "Mention any carpets, rugs or upholstery requiring specialist attention. We will confirm whether that work is available and include it separately rather than assuming it is part of the standard clean." },
    ],
    icon: KeyRound,
  },
  {
    slug: "deep-move-cleaning",
    title: "Deep & move-in/move-out cleaning",
    shortTitle: "Deep & move cleaning",
    category: "Cleaning",
    summary: "One-off intensive cleaning for property preparation, changeovers, move-ins and move-outs, with priorities agreed in advance.",
    audience: "Homeowners, tenants, landlords, agents and property managers",
    headline: "A deeper reset for properties between stages.",
    intro: "A deep or changeover clean is shaped around the condition of the property and what needs to happen next. We identify high-use areas, accumulated residue, appliances and access limitations before agreeing the task list.",
    includes: [
      "Detailed dusting and wiping of accessible surfaces",
      "Kitchen degreasing and bathroom descaling within the agreed scope",
      "Skirting boards, doors, handles, switches and visible fittings",
      "Vacuuming and mopping appropriate flooring",
      "Selected internal cupboards and appliances when quoted",
      "A final inspection against the agreed priorities",
    ],
    preparation: [
      "Reason for the clean and required outcome",
      "Property size, occupancy and furnishing",
      "Photographs of heavy build-up where useful",
      "Utilities, water and electricity availability",
      "Access, parking and preferred date",
    ],
    process: [
      { title: "Inspect", detail: "We identify priorities, surfaces and any limitations." },
      { title: "Prepare", detail: "Suitable products, equipment and the agreed task list are planned." },
      { title: "Deep clean", detail: "The team works through dust, grease, scale and flooring methodically." },
      { title: "Inspect again", detail: "The completed scope is checked before handover." },
    ],
    faqs: [
      { question: "What is the difference between a deep clean and regular cleaning?", answer: "A deep clean is a more intensive one-off visit focused on accumulated build-up and detailed areas. Regular cleaning maintains an already established standard through a repeated task list." },
      { question: "Can this be arranged before moving in?", answer: "Yes. Share the key date and whether the property will be empty, furnished or recently renovated so the appropriate scope can be discussed." },
    ],
    icon: Sparkles,
  },
  {
    slug: "regular-commercial-cleaning",
    title: "Regular & commercial cleaning",
    shortTitle: "Regular & commercial",
    category: "Cleaning",
    summary: "Planned cleaning for homes, offices, communal areas and managed properties, based on a repeatable task specification.",
    audience: "Households, offices, landlords, agents and property managers",
    headline: "Repeatable cleaning built around how the space is used.",
    intro: "Regular and commercial cleaning begins with a clear task specification. We agree priorities, frequency, access and any site-specific requirements so the service can be delivered consistently and reviewed over time.",
    includes: [
      "A site-appropriate task list and cleaning frequency",
      "Kitchen, washroom and common-area routines",
      "Dusting, vacuuming and mopping of agreed areas",
      "Access and alarm arrangements recorded in advance",
      "Periodic review of priorities and service quality",
    ],
    preparation: [
      "Property type and approximate floor area",
      "Preferred days, times and frequency",
      "Occupancy and public-access considerations",
      "Site contact, keys, alarms and restricted areas",
      "Any site-specific products or safety requirements",
    ],
    process: [
      { title: "Survey", detail: "The space, usage and priorities are reviewed." },
      { title: "Specify", detail: "Tasks, frequency and access arrangements are documented." },
      { title: "Schedule", detail: "Visits are coordinated around occupancy and site needs." },
      { title: "Review", detail: "The task list can be adjusted as the property changes." },
    ],
    faqs: [
      { question: "Do you clean communal areas?", answer: "Communal and managed-property cleaning can be discussed. Provide the number of floors, entrances, shared facilities and preferred frequency for an appropriate scope." },
      { question: "Can cleaning take place outside normal working hours?", answer: "Share the required access window. Availability depends on location, frequency and the site arrangements, and will be confirmed before booking." },
    ],
    icon: Building2,
  },
] as const;

export const cleaningServices = services;

export const cleaningTypes = [
  "End-of-Tenancy Cleaning",
  "Deep Cleaning",
  "Domestic & Residential Cleaning",
  "Commercial & Office Cleaning",
  "Regular & One-Off Cleaning",
  "Carpet & Rug Cleaning",
  "Sofa & Upholstery Cleaning",
  "Curtain Cleaning",
  "Mattress Cleaning",
  "Kitchen Deep Cleaning",
  "Oven, Cooker & Grill Cleaning",
  "Fridge, Freezer & Appliance Cleaning",
  "Bathroom Deep Cleaning",
  "After-Builders Cleaning",
  "Communal Area Cleaning",
  "Pressure & Jet Washing",
  "Waste Removal",
  "Housekeeping Services",
] as const;

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

import { Armchair, Building2, Hammer, House, KeyRound, Sparkles } from "lucide-react";

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
    slug: "domestic-cleaning",
    title: "Domestic cleaning",
    shortTitle: "Domestic cleaning",
    category: "Cleaning",
    summary: "Regular or one-off home cleaning tailored to your household, priorities and preferred schedule.",
    audience: "Homeowners, tenants and households",
    headline: "A cleaner, more comfortable home on a schedule that suits you.",
    intro: "Domestic cleaning can be arranged as a one-off visit or a recurring service. We agree the rooms, priorities, frequency and access arrangements in advance so the cleaning plan reflects your home and the way it is used.",
    includes: [
      "Dusting and wiping of agreed accessible surfaces",
      "Kitchen worktops, sinks, splashbacks and external appliance surfaces",
      "Bathroom sanitaryware, mirrors and agreed tiled areas",
      "Vacuuming and mopping of suitable floor surfaces",
      "Bedrooms, living areas, doors, handles and switches within the agreed scope",
      "A repeatable task list for recurring visits",
    ],
    preparation: [
      "Property type, size and priority rooms",
      "Whether you need a one-off or recurring service",
      "Preferred days, times and frequency",
      "Occupancy, pets and access arrangements",
      "Any areas needing extra attention",
    ],
    process: [
      { title: "Discuss", detail: "Tell us about your home, priorities and preferred schedule." },
      { title: "Plan", detail: "We agree the rooms, tasks, frequency and quotation." },
      { title: "Clean", detail: "The team follows the confirmed cleaning plan." },
      { title: "Review", detail: "Recurring priorities can be adjusted as your household needs change." },
    ],
    faqs: [
      { question: "Can I book a one-off domestic clean?", answer: "Yes. Domestic cleaning can be discussed as a one-off visit or a recurring arrangement. Share the property details and the areas you want prioritised." },
      { question: "Do I need to be at home?", answer: "Not necessarily. We can discuss keys, access, pets and any alarm arrangements before the booking is confirmed." },
      { question: "Are cleaning products and equipment included?", answer: "The required products and equipment depend on the agreed tasks and surfaces. We confirm what will be provided, and any site-specific requirements, in advance." },
    ],
    icon: House,
  },
  {
    slug: "end-of-tenancy-cleaning",
    title: "End-of-tenancy cleaning for tenants, landlords and letting agents",
    shortTitle: "End-of-tenancy cleaning",
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
      "Interior window glass and sills where safe and accessible",
      "Carpet and rug cleaning within the agreed rooms",
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
      { question: "Are interior windows and carpets included?", answer: "Yes. Interior window glass and sills, plus carpet and rug cleaning in the agreed rooms, are included when a deep-cleaning scope is confirmed. Safe access, material condition and any specialist stain treatment are reviewed before booking." },
    ],
    icon: Sparkles,
  },
  {
    slug: "commercial-office-cleaning",
    title: "Commercial and office cleaning",
    shortTitle: "Commercial & office",
    category: "Cleaning",
    summary: "Planned cleaning for offices, workplaces, communal areas and managed properties, based on a repeatable task specification.",
    audience: "Businesses, offices, landlords, agents and property managers",
    headline: "Presentable workplaces, cleaned around your business and operating hours.",
    intro: "Commercial and office cleaning begins with a clear task specification. We agree priorities, frequency, access and site-specific requirements so cleaning can be coordinated around the way your premises operate and reviewed over time.",
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
  {
    slug: "carpet-upholstery-cleaning",
    title: "Carpet and upholstery cleaning",
    shortTitle: "Carpet & upholstery",
    category: "Cleaning",
    summary: "Carpet, rug, sofa and upholstery cleaning planned around the material, condition and areas requiring attention.",
    audience: "Homeowners, tenants, landlords, offices and managed properties",
    headline: "A considered refresh for carpets, rugs and upholstered furniture.",
    intro: "Carpet and upholstery cleaning starts by identifying the material, condition, affected areas and access. We agree which rooms or items are included and discuss visible marks, drying considerations and any treatment limitations before quotation.",
    includes: [
      "Carpets and rugs in the rooms agreed in the quotation",
      "Sofas, chairs and other agreed upholstered furniture",
      "Pre-clean review of material, condition and visible marks",
      "Suitable cleaning methods selected for the item or floor covering",
      "Focused attention to agreed high-use areas",
      "Clear guidance about drying and access after cleaning",
    ],
    preparation: [
      "The number and approximate size of carpeted rooms",
      "The type and number of upholstered items",
      "Photographs of labels, marks or areas of concern where useful",
      "Parking, access and furniture-moving requirements",
      "Your preferred date and required completion time",
    ],
    process: [
      { title: "Review", detail: "We identify the material, condition, items and rooms involved." },
      { title: "Confirm", detail: "The method, included areas and any limitations are agreed." },
      { title: "Clean", detail: "The confirmed carpets or upholstered items are treated methodically." },
      { title: "Aftercare", detail: "We explain drying expectations and any relevant follow-up guidance." },
    ],
    faqs: [
      { question: "Can you guarantee every stain will be removed?", answer: "No responsible cleaning service can guarantee removal of every mark. Results depend on the material, age and cause of the stain. We discuss visible concerns and realistic limitations before work begins." },
      { question: "How long will carpets or upholstery take to dry?", answer: "Drying time varies with the material, cleaning method, ventilation and conditions at the property. Practical guidance is provided for the agreed work." },
      { question: "Can this be added to another cleaning service?", answer: "Yes. Select carpet or upholstery cleaning alongside the other services required so the full scope and scheduling can be reviewed together." },
    ],
    icon: Armchair,
  },
  {
    slug: "after-builders-cleaning",
    title: "After-builders cleaning",
    shortTitle: "After-builders cleaning",
    category: "Cleaning",
    summary: "Post-renovation cleaning for agreed construction dust and residue, helping prepare the property for occupation or handover.",
    audience: "Homeowners, landlords, developers, contractors and property managers",
    headline: "The detailed clean between completed building work and a usable property.",
    intro: "After-builders cleaning is planned around the work completed, the remaining dust or residue and the condition of each area. We confirm that construction work is finished, utilities are available and heavy building waste has been removed before agreeing the cleaning scope.",
    includes: [
      "Removal of accessible fine dust from agreed surfaces and fittings",
      "Wiping of skirting, doors, frames, switches and visible fixtures",
      "Kitchen and bathroom cleaning within the confirmed areas",
      "Vacuuming and mopping of suitable finished floors",
      "Interior window glass and sills where safe and agreed",
      "A final review against the confirmed post-work cleaning scope",
    ],
    preparation: [
      "Property type and the rooms affected by building work",
      "The nature of the renovation or construction completed",
      "Confirmation that contractors and active works have finished",
      "Details of remaining waste, paint, adhesive or specialist residue",
      "Access, parking, utilities and required completion date",
    ],
    process: [
      { title: "Assess", detail: "We review the completed works, affected rooms and remaining residue." },
      { title: "Scope", detail: "Included surfaces, exclusions and any specialist needs are documented." },
      { title: "Clean", detail: "Dust and agreed residue are removed in a structured sequence." },
      { title: "Check", detail: "The completed areas are reviewed against the accepted scope." },
    ],
    faqs: [
      { question: "Does building work need to be finished first?", answer: "Yes. The property should be safe to access and active building work should be complete before the clean. This helps prevent new dust or debris from undoing the work." },
      { question: "Is heavy construction waste included?", answer: "Heavy rubble, skips and hazardous building waste are not assumed to be part of the cleaning service. Tell us what remains at the property so any exclusions or separate arrangements are clear." },
      { question: "Can paint or adhesive residue be removed?", answer: "Mention and photograph specialist residue before quotation. The appropriate approach depends on the surface and material, and removal may require separate assessment." },
    ],
    icon: Hammer,
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
  "Driveway & Porch Washing",
  "Waste Removal",
  "Housekeeping Services",
] as const;

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

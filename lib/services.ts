import { Bolt, Building2, Flame, Home, KeyRound, Sparkles } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  category: "Cleaning" | "Property compliance";
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
  {
    slug: "epc-assessments",
    title: "EPC assessments",
    shortTitle: "EPC assessments",
    category: "Property compliance",
    summary: "Appointment coordination for property energy assessments and the resulting Energy Performance Certificate.",
    audience: "Property owners, landlords, sellers and letting agents",
    headline: "Energy assessment appointments coordinated clearly.",
    intro: "An EPC records a property’s energy-efficiency rating and recommendations. We coordinate the appointment and access with an appropriately accredited assessor, keeping the property details and important dates together.",
    includes: [
      "Appointment coordination and access planning",
      "An on-site assessment by an appropriately accredited assessor",
      "Review of relevant building fabric, heating and fixed services",
      "Certificate lodgement through the approved process",
      "Communication of the completed certificate details",
    ],
    preparation: [
      "Full property address and property type",
      "Reason for the assessment and important date",
      "Owner, tenant or agent access contact",
      "Any existing certificate information",
      "Relevant alterations or energy improvements",
    ],
    process: [
      { title: "Check", detail: "We collect the address, property type and deadline." },
      { title: "Arrange", detail: "Access is coordinated with an appropriately accredited assessor." },
      { title: "Assess", detail: "The property is inspected for the information needed for the EPC." },
      { title: "Complete", detail: "The certificate is lodged and the result communicated." },
    ],
    faqs: [
      { question: "How long is an EPC generally valid?", answer: "Domestic EPCs are generally valid for ten years unless a newer certificate is produced. Existing certificate details should be checked before arranging another assessment." },
      { question: "Who completes the assessment?", answer: "The assessment is carried out by an appropriately accredited energy assessor. Coreserve coordinates the property information, access and appointment." },
    ],
    icon: Home,
  },
  {
    slug: "gas-safety",
    title: "Gas safety coordination",
    shortTitle: "Gas safety",
    category: "Property compliance",
    summary: "Appointment coordination for landlord gas safety checks carried out by a Gas Safe registered engineer.",
    audience: "Landlords, letting agents and managed residential properties",
    headline: "Gas safety appointments without the contractor chase.",
    intro: "Landlord gas safety checks must be completed by a Gas Safe registered engineer. Coreserve coordinates the relevant property, appliance and access information and helps keep follow-up communication clear.",
    includes: [
      "Coordination with an appropriately registered engineer",
      "Appointment planning with landlord, agent or tenant",
      "Checks covering relevant landlord-provided appliances and flues",
      "Communication about the issued record and reported observations",
      "Support arranging follow-up where further work is identified",
    ],
    preparation: [
      "Property address and access contact",
      "Appliance details where known",
      "Current certificate date or copy",
      "Tenancy or renewal deadline",
      "Any known faults or access restrictions",
    ],
    process: [
      { title: "Details", detail: "We collect the property, appliance and certificate information." },
      { title: "Engineer", detail: "An appropriately registered engineer and appointment are coordinated." },
      { title: "Check", detail: "The engineer completes the required inspection and testing." },
      { title: "Record", detail: "The result and any recommended follow-up are communicated." },
    ],
    faqs: [
      { question: "Does Coreserve carry out the gas check directly?", answer: "The safety check is carried out by a Gas Safe registered engineer. Coreserve provides the coordination and communication around the appointment." },
      { question: "What information should I provide?", answer: "Send the full address, access contact, known appliances, current certificate date and the date by which the new check is needed." },
    ],
    icon: Flame,
  },
  {
    slug: "electrical-safety-eicr",
    title: "Electrical safety & EICR coordination",
    shortTitle: "Electrical safety",
    category: "Property compliance",
    summary: "Coordination of fixed electrical installation inspection and testing with an appropriately qualified professional.",
    audience: "Landlords, agents, property managers and businesses",
    headline: "Electrical inspection coordination with practical follow-up.",
    intro: "An Electrical Installation Condition Report records the condition of a property’s fixed electrical installation and identifies observations requiring investigation or remedial work. We coordinate the information, access and qualified professional needed for the inspection.",
    includes: [
      "Appointment coordination with an appropriately qualified professional",
      "Inspection and testing of the fixed electrical installation",
      "A written report recording the result and classification codes",
      "Clear identification of investigative or remedial work where reported",
      "Support coordinating the appropriate next step",
    ],
    preparation: [
      "Property address and type",
      "Previous report date or copy where available",
      "Access and responsible contact",
      "Tenancy or compliance deadline",
      "Known electrical concerns or recent work",
    ],
    process: [
      { title: "Review", detail: "We collect the property and previous report information." },
      { title: "Arrange", detail: "Access is coordinated with an appropriately qualified professional." },
      { title: "Inspect", detail: "The fixed installation is inspected and tested." },
      { title: "Report", detail: "The report result and any next steps are communicated." },
    ],
    faqs: [
      { question: "What does an EICR cover?", answer: "An EICR concerns the condition of the fixed electrical installation. Portable appliances and remedial work are separate unless specifically included in an agreed scope." },
      { question: "Who carries out the inspection?", answer: "The inspection and testing are completed by an appropriately qualified electrical professional. Coreserve coordinates the appointment and follow-up." },
    ],
    icon: Bolt,
  },
] as const;

export const cleaningServices = services.filter((service) => service.category === "Cleaning");
export const complianceServices = services.filter((service) => service.category === "Property compliance");

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

import { Bolt, Flame, Home, Sparkles } from "lucide-react";

export const services = [
  {
    slug: "cleaning-services",
    title: "Cleaning services",
    shortTitle: "Cleaning",
    summary:
      "Reliable cleaning for homes, offices, communal areas and managed properties, shaped around the building and its schedule.",
    icon: Sparkles,
    audience: "Homeowners, landlords, letting agents, offices and property managers",
    intro:
      "A practical cleaning service starts with the property, the standard required and how the space is used. We agree the scope before work begins so routine tasks, access arrangements and priorities are clear.",
    includes: [
      "Regular domestic and workplace cleaning",
      "Communal-area and managed-property cleaning",
      "End-of-tenancy and changeover cleaning",
      "One-off deep cleaning and property preparation",
      "A schedule agreed around access and occupancy",
    ],
    process:
      "Tell us the property type, approximate size, postcode and preferred frequency. We will discuss access, priorities and any areas requiring particular attention before confirming the next step.",
  },
  {
    slug: "epc-assessments",
    title: "EPC assessments",
    shortTitle: "EPC assessments",
    summary:
      "Property energy assessments that produce the familiar A–G rating and practical recommendations recorded on an Energy Performance Certificate.",
    icon: Home,
    audience: "Property owners, landlords, sellers and letting agents",
    intro:
      "An EPC gives a building an energy-efficiency rating from A to G and is normally needed when a property is built, sold or rented. Domestic EPCs are generally valid for ten years unless a newer certificate is produced.",
    includes: [
      "Appointment coordination and access planning",
      "An on-site assessment by an appropriately accredited assessor",
      "Review of the building fabric, heating and relevant fixed services",
      "Lodgement of the certificate through the approved process",
      "A certificate with the current rating and improvement recommendations",
    ],
    process:
      "Share the address, property type, reason for the assessment and any important marketing or tenancy date. We will confirm what access is needed and whether an existing valid EPC is already available.",
    source: {
      label: "Read the official GOV.UK EPC guidance",
      href: "https://www.gov.uk/selling-a-home/energy-performance-certificates",
    },
  },
  {
    slug: "gas-safety",
    title: "Gas safety coordination",
    shortTitle: "Gas safety",
    summary:
      "Straightforward appointment coordination for landlord gas safety checks carried out by a Gas Safe registered engineer.",
    icon: Flame,
    audience: "Landlords, letting agents and managed residential properties",
    intro:
      "Landlords must arrange an annual gas safety check for gas appliances and flues they provide for tenants. The check must be completed by a Gas Safe registered engineer, with records issued and retained as required.",
    includes: [
      "Coordination with an appropriately registered engineer",
      "Appointment planning with landlord, agent or tenant",
      "Checks covering relevant landlord-provided appliances and flues",
      "Clear communication about the record and any reported issues",
      "Support arranging follow-up where further work is identified",
    ],
    process:
      "Provide the property address, appliance details where known, current certificate date and access contact. We will confirm availability and the arrangements before booking.",
    source: {
      label: "Read the official HSE landlord gas-safety guidance",
      href: "https://www.hse.gov.uk/gas/domestic/faqlandlord.htm",
    },
  },
  {
    slug: "electrical-safety-eicr",
    title: "Electrical safety checks",
    shortTitle: "Electrical safety",
    summary:
      "Coordination of electrical installation inspection and testing, commonly documented through an EICR, with a qualified professional.",
    icon: Bolt,
    audience: "Landlords, agents, property managers and businesses",
    intro:
      "An Electrical Installation Condition Report records the condition of a property’s fixed electrical installation and identifies issues requiring investigation or remedial work. Rental-sector duties require inspections at least every five years, or sooner where the report requires it.",
    includes: [
      "Appointment coordination with a qualified electrical professional",
      "Inspection and testing of the fixed electrical installation",
      "A written report explaining the result and classification codes",
      "Clear identification of investigative or remedial work where required",
      "Support arranging the appropriate follow-up",
    ],
    process:
      "Send the property address, property type, previous report date if known and access details. We will confirm the inspection scope and appointment arrangements.",
    source: {
      label: "Read the official GOV.UK electrical-safety guidance",
      href: "https://www.gov.uk/government/publications/electrical-safety-standards-in-the-private-and-social-rented-sectors-guidance/electrical-safety-standards-in-the-private-and-social-rented-sectors-guidance",
    },
  },
] as const;

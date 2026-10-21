import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "End-of-Tenancy Cleaning Checklist Preston",
  description: "Review the room-by-room points Coreserve considers when scoping an end-of-tenancy clean in Preston.",
  alternates: { canonical: "/end-of-tenancy-cleaning-checklist" },
};

const sections = [
  { title: "Before the visit", items: ["Property size and number of bathrooms confirmed", "Occupancy and furnishing status recorded", "Water and electricity availability checked", "Keys, access, alarms and parking arranged", "Inventory or handover deadline shared"] },
  { title: "Kitchen", items: ["Worktops and accessible surfaces", "Cupboards inside and/or outside as quoted", "Splashbacks, sink and taps", "Grease attention on agreed areas", "Floor vacuuming and mopping", "Appliance interiors only where itemised"] },
  { title: "Bathrooms", items: ["Toilet, bath and/or shower", "Sinks, taps and accessible tiles", "Limescale attention", "Mirrors and glass", "Floor vacuuming and mopping"] },
  { title: "Bedrooms & living areas", items: ["Accessible surfaces and shelves", "Wardrobes or cupboards where included", "Skirting boards, doors and handles", "Switches and visible fittings", "Internal windows and sills where included", "Suitable floors vacuumed or mopped"] },
  { title: "Selected extras", items: ["Internal oven or cooker cleaning", "Dishwasher, fridge or washing-machine interiors", "Carpet extraction or specialist floor care", "Sofa, upholstery or curtain attention", "Waste removal only where specifically agreed and appropriately arranged"] },
  { title: "Final review", items: ["Agreed checklist reviewed", "Approved variations recorded", "Before/after evidence where permission and arrangements allow", "Access items or keys returned as agreed", "Customer or responsible contact updated"] },
];

export default function ChecklistPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="shell page-hero__grid"><div><span className="eyebrow eyebrow--light">Cleaning checklist</span><h1>End-of-tenancy scope, room by room.</h1></div><div><p>This checklist explains the areas considered during quotation. Your final accepted quotation—not this page—defines the work included in a booking.</p><Link className="button button--primary" href="/contact?service=end-of-tenancy-cleaning">Request an itemised quote <ArrowRight /></Link></div></div></section>
      <section className="section"><div className="shell"><div className="notice"><Info /><p><strong>Important:</strong> property condition and safe access affect what can be completed. Appliances, carpets, upholstery and waste are not automatically included; they must appear in the agreed quotation.</p></div><div className="checklist-grid">{sections.map((section, index) => <article key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2><ul>{section.items.map((item) => <li key={item}><Check /> {item}</li>)}</ul></article>)}</div></div></section>
      <section className="section section--pale"><div className="shell service-content-grid service-content-grid--balanced"><div><span className="eyebrow">Why an itemised scope matters</span><h2>The word “clean” can mean different things.</h2><p className="lead-copy">Separating standard tasks from appliance interiors, specialist surfaces and other extras protects both sides from assumptions. It also helps us plan the right time, products and equipment.</p></div><div className="room-scope"><div><span>Included</span><strong>Written into the accepted quotation</strong></div><div><span>Extra</span><strong>Priced separately where requested</strong></div><div><span>Variation</span><strong>Discussed before additional work</strong></div></div></div></section>
      <section className="cta-band"><div className="shell cta-band__inner"><div><h2>Ready to describe the property?</h2></div><Link className="button button--primary" href="/contact?service=end-of-tenancy-cleaning">Prepare your enquiry <ArrowRight /></Link></div></section>
    </main>
  );
}

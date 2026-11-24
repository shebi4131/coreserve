import { getService } from "@/lib/services";
import { siteConfig } from "@/lib/site";

export type Faq = { question: string; answer: string };
export type FaqIcon = "booking" | "prices" | "areas" | "quality" | "tenancy" | "deep" | "appliance" | "jet" | "carpet" | "airbnb" | "builders";
export type FaqCategory = {
  id: string;
  title: string;
  description: string;
  icon: FaqIcon;
  link?: { href: string; label: string };
  faqs: readonly Faq[];
};

// Service FAQs are pulled from the service pages so both stay in sync.
const serviceFaqs = (...slugs: string[]) => slugs.flatMap((slug) => getService(slug)?.faqs ?? []);

export const faqCategories: readonly FaqCategory[] = [
  {
    id: "booking",
    title: "Booking & quotes",
    description: "How to get a free quote and what happens next.",
    icon: "booking",
    link: { href: "/contact", label: "Get a free quote" },
    faqs: [
      { question: "How do I get a free cleaning quote?", answer: `Fill in the quote form on our website, message us on WhatsApp or call ${siteConfig.phoneDisplay}. Tell us the service, postcode, property size and preferred date, and we reply with an itemised quote.` },
      { question: "Is the quote free and with no obligation?", answer: "Yes. Every quote is free and there is no obligation to book. Nothing is arranged until you accept the quote." },
      { question: "What information do you need for an accurate quote?", answer: "The postcode, property type, number of bedrooms and bathrooms, whether it is furnished, its condition, the services and extras you need, your preferred date and any access or parking details. Photos help for heavy build-up, ovens and outdoor areas." },
      { question: "What happens after I send an enquiry?", answer: "We review your details, ask for anything important that is missing, then send an itemised quote with the date we can attend. Once you accept, we confirm the booking, access and key arrangements." },
      { question: "Can I book more than one service at once?", answer: "Yes. Select every service you need in one enquiry, for example an end-of-tenancy clean with oven, fridge and carpet cleaning, and we plan them in the right order in a single visit where possible." },
      { question: "How far in advance should I book?", answer: "As soon as you know your date, especially for end-of-tenancy cleans at the end of the month, when demand is highest. Short-notice bookings are often possible, so it is always worth asking." },
      { question: "Do I need to be at the property during the clean?", answer: "No. Most customers leave a key, use a key safe or arrange collection from the letting agent. We confirm how we get in and where the keys go afterwards before the clean." },
    ],
  },
  {
    id: "prices",
    title: "Prices",
    description: "Starting prices and how your final price is worked out.",
    icon: "prices",
    link: { href: "/services#prices", label: "See all prices" },
    faqs: [
      { question: "How much does end of tenancy cleaning cost?", answer: "End of tenancy cleaning starts from £110. The final price depends on the number of bedrooms and bathrooms, whether the property is furnished, its condition and any extras such as oven or carpet cleaning." },
      { question: "How much does a deep clean cost?", answer: "Deep cleaning starts from £105. Larger properties, heavy build-up and added appliances or carpets increase the price, and your itemised quote shows every part." },
      { question: "How much is oven, fridge and appliance cleaning?", answer: "Oven cleaning starts from £35, fridge or freezer cleaning from £25, washing machine cleaning from £15 and microwave cleaning from £12. They can be booked on their own or added to any clean." },
      { question: "How much does driveway jet washing cost?", answer: "Driveway jet washing starts from £65 and balcony cleaning from £45. Patios, paths, decking and walls are priced by size and condition, so send photos for a fast quote." },
      { question: "How much is sofa and curtain cleaning?", answer: "Sofa cleaning starts from £20 and curtain cleaning from £25. The price depends on the size, fabric and condition of each item." },
      { question: "Why might my price be higher than the starting price?", answer: "Starting prices are for a standard job. Larger properties, heavy grease or limescale, pets, difficult access or extra appliances take longer. Your itemised quote explains exactly what you are paying for before you book." },
      { question: "Are there any hidden charges?", answer: "No. Every room, task and extra is listed in your quote. If anything changes on the day, we discuss it with you first rather than adding it to the bill." },
    ],
  },
  {
    id: "areas",
    title: "Areas & opening hours",
    description: "Where we clean and when you can reach us.",
    icon: "areas",
    link: { href: "/areas-we-cover", label: "Check your area" },
    faqs: [
      { question: "Which areas do you cover?", answer: "We clean properties across the UK, with our own teams in Lancashire, Greater Manchester, Merseyside and London. Enter your postcode in the quote form and we confirm the earliest date we can attend." },
      { question: "Do you cover Burnley, Preston and Blackburn?", answer: "Yes. Our Lancashire team covers Burnley, Preston, Blackburn, Accrington, Blackpool, Lancaster, Chorley, Leyland and the surrounding towns." },
      { question: "Do you cover Manchester, Liverpool and London?", answer: "Yes. Our own teams work across Greater Manchester (including Salford, Stockport, Bolton and Wigan), Merseyside (including Liverpool, St Helens and the Wirral) and Greater London." },
      { question: "What are your opening hours?", answer: `We are open 7 days a week, 9am to 7pm. Call ${siteConfig.phoneDisplay}, message us on WhatsApp or send a quote request at any time.` },
      { question: "Do you work at weekends?", answer: "Yes. We are open seven days a week, so weekend cleans can be arranged, subject to availability on your date." },
    ],
  },
  {
    id: "quality",
    title: "Quality & standards",
    description: "How we check the work and keep you updated.",
    icon: "quality",
    link: { href: "/about", label: "About Coreserve" },
    faqs: [
      { question: "How do I know the job has been done properly?", answer: "The team works through a room-by-room checklist. When the job is finished you receive completion photos and a written summary the same day, including anything we could not complete and why." },
      { question: "Can you work from my letting agent's checklist?", answer: "Yes. Send the inventory, check-out report or the agent's own cleaning list with your enquiry and we quote against it and clean to it room by room." },
      { question: "What if I am not happy with something?", answer: "Contact us as soon as possible with details and photos. We review it against the agreed checklist and completion photos and discuss the next step with you. Our complaints page explains the full process." },
      { question: "Do you send photos after the clean?", answer: "Yes. Completion photos and a written job summary are sent the same day, which is useful evidence for tenants, landlords and letting agents." },
    ],
  },
  {
    id: "end-of-tenancy",
    title: "End of tenancy cleaning",
    description: "Move-out cleans for tenants, landlords and letting agents.",
    icon: "tenancy",
    link: { href: "/services/end-of-tenancy-cleaning", label: "End of tenancy cleaning" },
    faqs: serviceFaqs("end-of-tenancy-cleaning"),
  },
  {
    id: "deep-cleaning",
    title: "Deep & move-in cleaning",
    description: "Intensive one-off cleans before or after a move.",
    icon: "deep",
    link: { href: "/services/deep-move-cleaning", label: "Deep cleaning" },
    faqs: serviceFaqs("deep-move-cleaning"),
  },
  {
    id: "appliances",
    title: "Oven & appliance cleaning",
    description: "Ovens, fridges, freezers, microwaves and washing machines.",
    icon: "appliance",
    link: { href: "/services/oven-cleaning", label: "Oven cleaning" },
    faqs: serviceFaqs("oven-cleaning", "fridge-freezer-cleaning"),
  },
  {
    id: "jet-washing",
    title: "Jet washing",
    description: "Driveways, patios, decking and outdoor areas.",
    icon: "jet",
    link: { href: "/services/jet-washing", label: "Jet washing" },
    faqs: serviceFaqs("jet-washing"),
  },
  {
    id: "carpet-upholstery",
    title: "Carpet & upholstery",
    description: "Carpets, rugs, sofas and curtains.",
    icon: "carpet",
    link: { href: "/services/carpet-upholstery-cleaning", label: "Carpet & upholstery" },
    faqs: serviceFaqs("carpet-upholstery-cleaning"),
  },
  {
    id: "airbnb-commercial",
    title: "Airbnb & commercial",
    description: "Short-let changeovers, offices and managed properties.",
    icon: "airbnb",
    link: { href: "/services/bnb-housekeeping", label: "Airbnb & housekeeping" },
    faqs: serviceFaqs("bnb-housekeeping", "commercial-office-cleaning"),
  },
  {
    id: "after-builders",
    title: "After-builders cleaning",
    description: "Dust and residue removal after building work.",
    icon: "builders",
    link: { href: "/services/after-builders-cleaning", label: "After-builders cleaning" },
    faqs: serviceFaqs("after-builders-cleaning"),
  },
];

/** Every FAQ once (by question), for FAQPage structured data. */
export function allFaqs() {
  const seen = new Set<string>();
  return faqCategories.flatMap((category) => category.faqs).filter((faq) => {
    if (seen.has(faq.question)) return false;
    seen.add(faq.question);
    return true;
  });
}

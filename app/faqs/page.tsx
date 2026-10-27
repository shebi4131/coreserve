import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about Coreserve cleaning quotations, nationwide coverage, property access, selected extras and end-of-tenancy scope.",
  alternates: { canonical: "/faqs" },
};

const generalFaqs = [
  { question: "How do I request a quote?", answer: "Use the quote form to share the service, postcode, property type, size, condition, access and preferred date. Your answers open as a WhatsApp message for you to review before sending." },
  { question: "Do you publish fixed prices?", answer: "Not at present. Property condition, size, appliances, access, parking and selected extras can change the work required, so we confirm the scope before quoting." },
  { question: "What happens after I send an enquiry?", answer: "We review the details, ask for anything essential that is missing, assess the scope and availability, and then confirm the quotation and arrangements before booking." },
  { question: "Can I arrange more than one service?", answer: "Yes. Select multiple services or explain what the property needs. Availability and the appropriate order of work will be confirmed during the quotation process." },
  { question: "Do you provide nationwide coverage?", answer: "Yes. Coreserve is based in North-West England and serves customers nationwide across the United Kingdom. Send the property postcode and preferred date so the right arrangements can be confirmed." },
  { question: "Which specialist cleaning services can I select?", answer: "You can select more than one option, including upholstery, curtain, mattress, appliance, bathroom, after-builders, pressure washing, driveway and porch washing, waste removal and housekeeping services. Interior window and carpet cleaning are included within an agreed deep-cleaning scope. We will confirm exactly what is included in your quotation." },
];

export default function FaqPage() {
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: generalFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><section className="page-hero"><div className="shell page-hero__grid"><div><span className="eyebrow eyebrow--light">FAQs</span><h1>Useful answers before you enquire.</h1></div><div><p>Understand how quotations, nationwide coverage, cleaning scope and selected extras work.</p><Link className="button button--primary" href="/contact">Ask about your property <ArrowRight /></Link></div></div></section><section className="section"><div className="shell faq-layout"><div className="faq-layout__intro"><span className="eyebrow">General questions</span><h2>Quoting and booking</h2><img className="faq-illustration" src="/illustrations/looking-for-answers.svg" alt="" width="480" height="359" loading="lazy" decoding="async" /></div><div className="faq-list">{generalFaqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div></section><section className="section section--pale"><div className="shell"><div className="section-heading"><span className="eyebrow">Service questions</span><h2>Explore the detailed service pages.</h2></div><div className="link-directory">{services.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}><span>{service.category}</span><strong>{service.title}</strong><ArrowRight /></Link>)}</div></div></section></main>;
}

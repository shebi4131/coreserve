import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, MapPin } from "lucide-react";
import { AreaLocationPicker } from "@/components/AreaLocationPicker";
import { PostcodeChecker } from "@/components/PostcodeChecker";
import { QuoteForm } from "@/components/QuoteForm";
import { ServiceMark } from "@/components/ServiceMark";
import { getServiceArea, serviceAreas } from "@/lib/areas";
import { services } from "@/lib/services";
import { canonicalUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

type AreaPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) return {};
  return {
    title: `Cleaning Services in ${area.name}`,
    description: `${area.summary} Explore nearby locations, check your postcode and request a tailored cleaning quotation.`,
    alternates: { canonical: `/areas-we-cover/${area.slug}` },
    openGraph: {
      title: `Cleaning services in ${area.name} | Coreserve`, description: area.summary, url: `/areas-we-cover/${area.slug}`,
      images: [{ url: "/images/areas/nationwide-coverage.jpeg", width: 1312, height: 816, alt: `Professional cleaning services available in ${area.name}` }],
    },
  };
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) notFound();

  const schemas = [
    { "@context": "https://schema.org", "@type": "Service", name: `Cleaning services in ${area.name}`, description: area.summary, serviceType: "Professional cleaning", areaServed: [{ "@type": "AdministrativeArea", name: area.name }, { "@type": "AdministrativeArea", name: area.region }], provider: { "@id": `${canonicalUrl()}#business` }, url: canonicalUrl(`/areas-we-cover/${area.slug}`) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl() }, { "@type": "ListItem", position: 2, name: "Areas we cover", item: canonicalUrl("/areas-we-cover") }, { "@type": "ListItem", position: 3, name: area.name, item: canonicalUrl(`/areas-we-cover/${area.slug}`) }] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: area.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];
  const relatedAreas = serviceAreas.filter((item) => item.slug !== area.slug);

  return (
    <main id="main-content">
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
      <section className="area-detail-hero">
        <div className="area-detail-hero__pattern" />
        <div className="shell area-detail-hero__grid">
          <div className="area-detail-hero__copy">
            <nav className="area-breadcrumb area-breadcrumb--light" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/areas-we-cover">Areas</Link><span>/</span><span>{area.name}</span></nav>
            <Link className="back-link" href="/areas-we-cover"><ArrowLeft size={17} /> All service areas</Link>
            <span className="eyebrow eyebrow--light">{area.eyebrow}</span>
            <h1>Cleaning services in {area.name}</h1>
            <p>{area.summary}</p>
            <div className="area-postcode-pills" aria-label={`Postcode areas covered near ${area.name}`}>{area.postcodeAreas.map((postcode) => <span key={postcode}>{postcode}</span>)}</div>
            <div className="hero__actions"><a className="button button--primary" href="#quote-form">Request Free Quote <ArrowRight size={18} /></a></div>
          </div>
          <PostcodeChecker areaSlug={area.slug} heading={`Check ${area.name} coverage`} />
        </div>
      </section>
      <section className="section area-intro">
        <div className="shell area-intro__grid">
          <div><span className="eyebrow">Cleaning in {area.name}</span><h2>Local detail, one coordinated service.</h2><p className="lead-copy">{area.introduction}</p></div>
          <ul className="area-highlight-list">{area.highlights.map((highlight) => <li key={highlight}><Check size={18} /><span>{highlight}</span></li>)}</ul>
        </div>
      </section>
      <section className="section section--pale area-locations">
        <div className="shell">
          <div className="section-heading split-heading"><div><span className="eyebrow">Nearby locations</span><h2>Select your local area.</h2></div><p>Choose a location to carry its name and postcode district into the quote form below. You can replace it with the exact property postcode at any time.</p></div>
          <AreaLocationPicker locations={area.locations} />
        </div>
      </section>
      <section className="section area-services">
        <div className="shell">
          <div className="section-heading split-heading"><div><span className="eyebrow">Available services</span><h2>Cleaning shaped around the property.</h2></div><p>Choose a service for full details, or use the area quote form to combine several requirements in one enquiry.</p></div>
          <div className="area-service-grid">{services.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}><ServiceMark icon={service.icon} /><div><span>{service.category}</span><h3>{service.shortTitle}</h3><p>{service.summary}</p></div><ArrowUpRight size={20} /></Link>)}</div>
        </div>
      </section>
      <section className="section cleaning-form-section area-quote" id="quote-form">
        <div className="shell cleaning-form-layout">
          <div className="cleaning-form-intro"><span className="eyebrow">Quote in {area.name}</span><h2>Tell us about the property.</h2><p>The location is prepared for {area.name}. Select a nearby location above or replace the example with the full property postcode.</p><ul className="check-list"><li><Check /> Area and postcode carried into the form</li><li><Check /> Multiple services in one enquiry</li><li><Check /> No payment details required</li></ul></div>
          <QuoteForm defaultLocation={`${area.name} — ${area.postcodeExamples[0]}`} />
        </div>
      </section>
      <section className="section area-faq">
        <div className="shell faq-layout"><div className="faq-layout__intro"><span className="eyebrow">{area.name} questions</span><h2>Useful details before you enquire.</h2><p>Coverage is confirmed from the full postcode and required date, so the answer is specific to your property.</p></div><div className="faq-list">{area.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div>
      </section>
      <section className="section section--compact related-areas">
        <div className="shell"><div className="section-heading"><span className="eyebrow">Other areas we cover</span><h2>Our own teams also cover these areas.</h2></div><div className="related-area-grid">{relatedAreas.map((item) => <Link href={`/areas-we-cover/${item.slug}`} key={item.slug}><MapPin size={19} /><div><small>{item.region}</small><strong>{item.name}</strong></div><ArrowRight size={18} /></Link>)}</div></div>
      </section>
    </main>
  );
}


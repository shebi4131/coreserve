import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Phone, Tag } from "lucide-react";
import { TrustStrip } from "@/components/TrustStrip";
import { faqCategories } from "@/lib/faqs";
import { allPrices, lowestPrice, priceGroups, PRICES, quotedServices } from "@/lib/prices";
import { canonicalUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Cleaning Prices | End of Tenancy from £${PRICES.endOfTenancy}, Ovens from £${PRICES.oven}` },
  description: `Clear cleaning prices: end of tenancy from £${PRICES.endOfTenancy}, deep cleaning £${PRICES.deepCleaning}, oven £${PRICES.oven}, fridge £${PRICES.fridgeFreezer}, driveway jet washing £${PRICES.driveway}. Free itemised quotes.`,
  alternates: { canonical: "/prices" },
  openGraph: {
    title: "Cleaning prices | Coreserve Facilities Group",
    description: `Starting prices from £${lowestPrice}. Free itemised quotes with no hidden extras.`,
    url: "/prices",
    images: [{ url: "/images/services/services-hero.jpeg", width: 1376, height: 768, alt: "Coreserve cleaning team and equipment" }],
  },
};

const priceFactors = [
  "Number of bedrooms and bathrooms",
  "Whether the property is furnished or empty",
  "Condition: grease, limescale, pets or heavy build-up",
  "Extras such as ovens, fridges, carpets and sofas",
  "Access, parking and the date you need",
];

export default function PricesPage() {
  const priceFaqs = faqCategories.find((category) => category.id === "prices")?.faqs ?? [];
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "Coreserve cleaning prices",
      url: canonicalUrl("/prices"),
      itemListElement: allPrices.map((price) => ({
        "@type": "Offer",
        name: price.item,
        priceCurrency: "GBP",
        price: price.from.toFixed(2),
        priceSpecification: { "@type": "PriceSpecification", priceCurrency: "GBP", minPrice: price.from.toFixed(2) },
        url: canonicalUrl(price.href || "/prices"),
        seller: { "@id": `${canonicalUrl()}#business` },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: priceFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
    },
  ];

  return (
    <main id="main-content">
      {schema.map((item, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }} />)}

      <section className="page-hero">
        <div className="shell page-hero__grid">
          <div>
            <span className="eyebrow eyebrow--light">Prices · from £{lowestPrice}</span>
            <h1>Clear cleaning prices. No hidden extras.</h1>
          </div>
          <div>
            <p>Starting prices for our most popular services. Send your details for a free itemised quote that shows exactly what each part of the job costs before you book.</p>
            <div className="faq-hero__actions">
              <Link className="button button--primary" href="/contact">Get your exact price <ArrowRight size={18} /></Link>
              <a className="button button--ghost" href={siteConfig.phoneHref}><Phone size={18} /> {siteConfig.phoneDisplay}</a>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="section service-prices-section">
        <div className="shell price-groups">
          {priceGroups.map((group, index) => (
            <section className={index === 0 ? "price-group price-group--wide price-group--featured" : "price-group"} key={group.title} aria-labelledby={`price-${group.title}`}>
              <header>
                <h2 id={`price-${group.title}`}>{group.title}</h2>
                <p>{group.description}</p>
              </header>
              <ul>
                {group.items.map((price) => (
                  <li key={price.item}>
                    <Tag aria-hidden="true" />
                    {price.href ? <Link href={price.href}>{price.item}</Link> : <span>{price.item}</span>}
                    <strong><small>from</small> £{price.from}</strong>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="price-group price-group--wide price-group--quoted" aria-labelledby="price-quoted">
            <header>
              <h2 id="price-quoted">Priced on request</h2>
              <p>These vary too much by property to list a fair starting price. Quotes are free and fast.</p>
            </header>
            <ul>
              {quotedServices.map((service) => (
                <li key={service.item}>
                  <Tag aria-hidden="true" />
                  <Link href={service.href || "/contact"}>{service.item}</Link>
                  <span className="price-group__quote">Free quote <ArrowUpRight size={15} aria-hidden="true" /></span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <section className="section">
        <div className="shell service-content-grid service-content-grid--balanced">
          <div>
            <span className="eyebrow">How pricing works</span>
            <h2>Why your price may differ from the starting price.</h2>
            <p className="lead-copy">Starting prices cover a standard job. Your itemised quote is based on the property and lists every room, task and extra, so you can remove anything you do not need before booking.</p>
            <ul className="check-list">{priceFactors.map((factor) => <li key={factor}><Check /> {factor}</li>)}</ul>
          </div>
          <aside className="preparation-card">
            <Tag />
            <span className="eyebrow">Save on your clean</span>
            <h2>Combine services in one visit</h2>
            <ul>
              <li>Add oven (£{PRICES.oven}), fridge (£{PRICES.fridgeFreezer}) and microwave (£{PRICES.microwave}) cleaning to an end-of-tenancy clean</li>
              <li>Book sofa (£{PRICES.sofa}) and curtain (£{PRICES.curtain}) cleaning alongside a deep clean</li>
              <li>Pair driveway jet washing (£{PRICES.driveway}) with balcony cleaning (£{PRICES.balcony})</li>
            </ul>
            <Link className="button button--dark" href="/contact">Get a combined quote <ArrowRight size={18} /></Link>
          </aside>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell faq-layout">
          <div className="faq-layout__intro"><span className="eyebrow">Price questions</span><h2 className="service-faq-title">Common questions about cost.</h2><Link className="text-link" href="/faqs">All FAQs <ArrowRight size={17} /></Link></div>
          <div className="faq-list">
            {priceFaqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-band__inner">
          <div><span className="eyebrow eyebrow--light">Free itemised quote</span><h2>Get your exact price today.</h2><p>{siteConfig.businessHours}. Send your postcode and what needs cleaning.</p></div>
          <div className="cta-band__actions">
            <Link className="button button--primary" href="/contact">Get a free quote <ArrowRight size={18} /></Link>
            <a className="button button--outline-light" href={siteConfig.social.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp us</a>
          </div>
        </div>
      </section>
    </main>
  );
}

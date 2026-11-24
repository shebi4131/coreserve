"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Armchair, ArrowRight, BedDouble, CalendarCheck, ClipboardCheck, CookingPot, Droplets, Hammer, KeyRound,
  MapPin, PoundSterling, Search, Sparkles, X,
} from "lucide-react";
import type { FaqCategory, FaqIcon } from "@/lib/faqs";

const icons: Record<FaqIcon, typeof Search> = {
  booking: CalendarCheck,
  prices: PoundSterling,
  areas: MapPin,
  quality: ClipboardCheck,
  tenancy: KeyRound,
  deep: Sparkles,
  appliance: CookingPot,
  jet: Droplets,
  carpet: Armchair,
  airbnb: BedDouble,
  builders: Hammer,
};

export function FaqExplorer({ categories }: { categories: readonly FaqCategory[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");
  const term = query.trim().toLowerCase();

  const visible = useMemo(() => categories
    .filter((category) => active === "all" || category.id === active)
    .map((category) => ({
      ...category,
      faqs: term
        ? category.faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(term))
        : category.faqs,
    }))
    .filter((category) => category.faqs.length > 0), [categories, active, term]);

  const total = visible.reduce((sum, category) => sum + category.faqs.length, 0);

  return (
    <div className="faq-explorer">
      <div className="faq-toolbar">
        <label className="faq-search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">Search the FAQs</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions, e.g. oven price, keys, deposit"
          />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button> : null}
        </label>
        <div className="faq-chips" role="tablist" aria-label="FAQ categories">
          <button type="button" role="tab" aria-selected={active === "all"} className={active === "all" ? "is-active" : undefined} onClick={() => setActive("all")}>
            All topics
          </button>
          {categories.map((category) => {
            const Icon = icons[category.icon];
            return (
              <button key={category.id} type="button" role="tab" aria-selected={active === category.id} className={active === category.id ? "is-active" : undefined} onClick={() => setActive(category.id)}>
                <Icon aria-hidden="true" /> {category.title}
              </button>
            );
          })}
        </div>
        <p className="faq-count" aria-live="polite">{total} {total === 1 ? "answer" : "answers"}{term ? ` for “${query.trim()}”` : ""}</p>
      </div>

      {visible.length === 0 ? (
        <div className="faq-empty">
          <strong>No answers match “{query.trim()}”.</strong>
          <p>Try another word, or ask us directly. We reply quickly, 7 days a week.</p>
          <Link className="button button--dark" href="/contact">Ask your question <ArrowRight size={18} /></Link>
        </div>
      ) : (
        <div className="faq-categories">
          {visible.map((category) => {
            const Icon = icons[category.icon];
            return (
              <section key={category.id} id={category.id} className="faq-category" aria-labelledby={`faq-${category.id}`}>
                <header className="faq-category__head">
                  <span className="faq-category__icon"><Icon aria-hidden="true" /></span>
                  <div>
                    <h2 id={`faq-${category.id}`}>{category.title}</h2>
                    <p>{category.description}</p>
                  </div>
                  {category.link ? <Link className="faq-category__link" href={category.link.href}>{category.link.label} <ArrowRight size={16} /></Link> : null}
                </header>
                <div className="faq-category__list">
                  {category.faqs.map((faq) => (
                    <details key={faq.question} open={Boolean(term)}>
                      <summary>{faq.question}</summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

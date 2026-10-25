"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { cleaningTypes } from "@/lib/services";
import { siteConfig } from "@/lib/site";

const defaultSelections: Record<string, string[]> = {
  "end-of-tenancy-cleaning": ["End-of-Tenancy Cleaning"],
  "deep-move-cleaning": ["Deep Cleaning"],
  "regular-commercial-cleaning": ["Commercial & Office Cleaning", "Regular & One-Off Cleaning"],
};

type CleaningQuoteFormProps = {
  serviceSlug: string;
  serviceTitle: string;
};

export function CleaningQuoteForm({ serviceSlug, serviceTitle }: CleaningQuoteFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(defaultSelections[serviceSlug] ?? []);
  const [status, setStatus] = useState("");

  function toggleService(service: string) {
    setSelectedServices((current) => current.includes(service)
      ? current.filter((item) => item !== service)
      : [...current, service]);
    setStatus("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedServices.length === 0) {
      setStatus("Select at least one cleaning service before continuing.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const lines = [
      "Hello Coreserve Facilities Group, I would like a cleaning quotation.",
      "",
      `Enquiry page: ${serviceTitle}`,
      `Cleaning services: ${selectedServices.join(", ")}`,
      `Name: ${form.get("name")}`,
      `Mobile: ${form.get("phone")}`,
      `Email: ${form.get("email") || "Not provided"}`,
      `Postcode: ${form.get("postcode")}`,
      `Property address: ${form.get("address") || "Not provided"}`,
      `Property type: ${form.get("propertyType")}`,
      `Bedrooms: ${form.get("bedrooms") || "Not applicable / unsure"}`,
      `Required timing: ${form.get("timing")}`,
      `Preferred date: ${form.get("date") || "Flexible"}`,
      "",
      `Additional details: ${form.get("message") || "No additional details"}`,
    ];

    setStatus("WhatsApp opened with your enquiry. Review the details before sending.");
    window.open(
      `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form className="cleaning-quote-form" onSubmit={handleSubmit}>
      <div className="cleaning-quote-form__heading">
        <div>
          <span className="eyebrow eyebrow--compact">Free cleaning quote</span>
          <h2>Tell us what needs cleaning</h2>
          <p>Select every service you need, then add the property details. Nothing is sent until you review the WhatsApp message.</p>
        </div>
        <span className="secure-note"><CheckCircle2 size={18} /> Review first</span>
      </div>

      <fieldset className="cleaning-selector field-wide">
        <legend>Cleaning services required *</legend>
        <p>Select one or more options</p>
        <div className="cleaning-selector__scroll" aria-describedby="cleaning-selector-help">
          {cleaningTypes.map((service) => (
            <label key={service} className={selectedServices.includes(service) ? "is-selected" : undefined}>
              <input
                type="checkbox"
                name="cleaningServices"
                value={service}
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
              />
              <span>{service}</span>
            </label>
          ))}
        </div>
        <small id="cleaning-selector-help">{selectedServices.length} selected</small>
      </fieldset>

      <div className="form-grid cleaning-form-grid">
        <label><span>Full name *</span><input name="name" autoComplete="name" required placeholder="Your full name" /></label>
        <label><span>Mobile number *</span><input name="phone" type="tel" autoComplete="tel" required placeholder="Best contact number" /></label>
        <label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
        <label><span>Postcode *</span><input name="postcode" autoComplete="postal-code" required placeholder="Property postcode" /></label>
        <label className="field-wide"><span>Property address</span><input name="address" autoComplete="street-address" placeholder="House number and street, if known" /></label>
        <label>
          <span>Property or premises type *</span>
          <select name="propertyType" required defaultValue="">
            <option value="" disabled>Choose property type</option>
            <option>Flat / apartment</option><option>House</option><option>Office</option><option>Commercial premises</option><option>Communal / managed property</option><option>Other</option>
          </select>
        </label>
        <label>
          <span>Bedrooms</span>
          <select name="bedrooms" defaultValue="">
            <option value="">Not applicable / unsure</option><option>Studio</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
          </select>
        </label>
        <label>
          <span>When do you need the cleaning? *</span>
          <select name="timing" required defaultValue="">
            <option value="" disabled>Choose a timeframe</option><option>As soon as possible</option><option>Within 2–3 days</option><option>Within 1 week</option><option>Specific date</option><option>Flexible</option>
          </select>
        </label>
        <label><span>Preferred date</span><input name="date" type="date" /></label>
        <label className="field-wide"><span>Anything else we should know?</span><textarea name="message" rows={5} placeholder="Tell us about the condition, access, parking, deadlines, pets, heavy build-up or special requirements." /></label>
        <label className="consent-field field-wide">
          <input name="privacy" type="checkbox" required />
          <span>I agree that my details may be used to respond to this enquiry, as described in the <Link href="/privacy">privacy notice</Link>.</span>
        </label>
      </div>

      <div className="cleaning-quote-form__footer">
        <button className="button button--primary" type="submit"><MessageCircle size={18} /> Prepare WhatsApp quote <ArrowUpRight size={18} /></button>
        <p aria-live="polite">{status || "This website does not store your answers."}</p>
      </div>
    </form>
  );
}

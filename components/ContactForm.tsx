"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/site";

type FormState = "idle" | "ready";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lines = [
      "Hello Coreserve Facilities Group, I would like to request a quote.",
      "",
      `Name: ${form.get("name")}`,
      `Phone: ${form.get("phone")}`,
      `Email: ${form.get("email") || "Not provided"}`,
      `Service: ${form.get("service")}`,
      `Property location: ${form.get("location")}`,
      `Preferred timing: ${form.get("timing") || "Flexible"}`,
      "",
      `Details: ${form.get("message") || "No additional details"}`,
    ];
    setState("ready");
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="quote-form__heading">
        <div>
          <h2>Tell us about the property</h2>
          <p>We’ll prepare your details in WhatsApp so you can review them before sending.</p>
        </div>
        <span className="secure-note"><CheckCircle2 size={18} /> Review before sending</span>
      </div>
      <div className="form-grid">
        <label>
          <span>Your name *</span>
          <input name="name" autoComplete="name" required placeholder="Full name" />
        </label>
        <label>
          <span>Phone number *</span>
          <input name="phone" type="tel" autoComplete="tel" required placeholder="Best contact number" />
        </label>
        <label>
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </label>
        <label>
          <span>Service required *</span>
          <select name="service" required defaultValue="">
            <option value="" disabled>Choose a service</option>
            {services.map((service) => <option key={service.slug}>{service.title}</option>)}
            <option>Multiple services</option>
          </select>
        </label>
        <label className="field-wide">
          <span>Property postcode or location *</span>
          <input name="location" required placeholder="For example, Preston PR2" />
        </label>
        <label className="field-wide">
          <span>Preferred timing</span>
          <input name="timing" placeholder="For example, within two weeks" />
        </label>
        <label className="field-wide">
          <span>How can we help?</span>
          <textarea name="message" rows={5} placeholder="Tell us about the property, access, timescale and anything else we should know." />
        </label>
      </div>
      <div className="quote-form__footer">
        <button className="button button--primary" type="submit">Prepare WhatsApp enquiry <ArrowUpRight size={18} /></button>
        <p aria-live="polite">{state === "ready" ? "Your enquiry opened in WhatsApp. Please review and send it when ready." : "No information is stored by this website."}</p>
      </div>
    </form>
  );
}

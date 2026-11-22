"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LoaderCircle, Send } from "lucide-react";

const googleFormResponseUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSeUxVfeizHz3ewmjv1nGgtbhwFD8LrmQk_cLD8oIsDtIc_iCQ/formResponse";

const days = [
  { label: "Monday", entryId: "14549856" },
  { label: "Tuesday", entryId: "236559238" },
  { label: "Wednesday", entryId: "883975405" },
  { label: "Thursday", entryId: "620373940" },
  { label: "Friday", entryId: "1936188888" },
  { label: "Saturday", entryId: "1055888478" },
  { label: "Sunday", entryId: "1797552414" },
] as const;

const timeSlots = ["Morning", "Afternoon", "Evening", "Overnight"] as const;

const visaOptions = [
  "British or Irish citizen",
  "Settled status / indefinite leave to remain",
  "Pre-settled status",
  "Skilled Worker visa",
  "Student visa",
  "Dependant/family visa or other valid UK work permission",
  "Other",
] as const;

const coverageOptions = ["Preston", "Blackburn", "Blackpool", "Bolton", "Manchester", "Liverpool", "Southport", "Lancaster", "Other"] as const;
const travelOptions = ["Own car or van", "Public transport", "Bicycle or e-bike", "Walking / local jobs only", "Other"] as const;

const steps = [
  { number: 1, label: "Your details", title: "Start with your details", description: "Use current contact information so we can reach you if a suitable opportunity is available." },
  { number: 2, label: "Availability", title: "When can you work?", description: "Select every day and time period you can normally cover." },
  { number: 3, label: "Eligibility & travel", title: "Where and how can you work?", description: "Confirm your right-to-work status, coverage areas and travel arrangements." },
] as const;

type Day = typeof days[number]["label"];
type TimeSlot = typeof timeSlots[number];

function createInitialAvailability(): Record<Day, TimeSlot[]> {
  return {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };
}

export function CleanerApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [availability, setAvailability] = useState<Record<Day, TimeSlot[]>>(createInitialAvailability);
  const [visaStatus, setVisaStatus] = useState("");
  const [coverage, setCoverage] = useState<string[]>([]);
  const [travel, setTravel] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeStep = steps[currentStep - 1];
  const selectedAvailabilityCount = Object.values(availability).reduce((total, slots) => total + slots.length, 0);

  function clearStatus() {
    setStatus("");
    setStatusType("idle");
  }

  function setError(message: string) {
    setStatus(message);
    setStatusType("error");
  }

  function toggleAvailability(day: Day, slot: TimeSlot) {
    setAvailability((current) => ({
      ...current,
      [day]: current[day].includes(slot) ? current[day].filter((item) => item !== slot) : [...current[day], slot],
    }));
    clearStatus();
  }

  function toggleListItem(value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
    clearStatus();
  }

  function validateNativeFields(step: number) {
    const stepElement = formRef.current?.querySelector<HTMLElement>(`[data-form-step="${step}"]`);
    const fields = stepElement?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input:not([type='hidden']):not([type='checkbox']):not([type='radio']), select, textarea");
    const invalidField = Array.from(fields ?? []).find((field) => !field.checkValidity());
    if (!invalidField) return true;
    invalidField.reportValidity();
    return false;
  }

  function validateStep(step: number) {
    if (!validateNativeFields(step)) return false;

    if (step === 2 && selectedAvailabilityCount === 0) {
      setError("Select at least one day and time before continuing.");
      return false;
    }

    if (step === 3) {
      const form = formRef.current ? new FormData(formRef.current) : null;
      if (!form?.get("rightToWork")) {
        setError("Confirm whether you currently have the legal right to work in the UK.");
        return false;
      }
      if (!visaStatus) {
        setError("Select your current UK visa or immigration status.");
        return false;
      }
      if (visaStatus === "Other" && !String(form.get("otherVisa") || "").trim()) {
        setError("Enter your visa or immigration status.");
        return false;
      }
      if (coverage.length === 0) {
        setError("Select at least one town or area you can cover.");
        return false;
      }
      if (coverage.includes("Other") && !String(form.get("otherCoverage") || "").trim()) {
        setError("Enter the other town, postcode or area you can cover.");
        return false;
      }
      if (travel.length === 0) {
        setError("Select at least one way you can travel to cleaning jobs.");
        return false;
      }
      if (travel.includes("Other") && !String(form.get("otherTravel") || "").trim()) {
        setError("Enter your other means of travel.");
        return false;
      }
      if (!form.get("privacy")) {
        setError("Please agree to the privacy notice before submitting.");
        return false;
      }
    }

    return true;
  }

  function changeStep(nextStep: number) {
    clearStatus();
    setCurrentStep(nextStep);
    window.requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function goToNextStep() {
    if (validateStep(currentStep)) changeStep(currentStep + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(3)) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (form.get("website")) return;

    const payload = new URLSearchParams();
    payload.set("entry.2027093321", String(form.get("name") || ""));
    payload.set("entry.1659249132", String(form.get("email") || ""));
    payload.set("entry.678436824", String(form.get("phone") || ""));
    payload.set("entry.308416640", String(form.get("address") || ""));

    days.forEach((day) => {
      availability[day.label].forEach((slot) => payload.append(`entry.${day.entryId}`, slot));
    });

    payload.set("entry.1106436113", String(form.get("rightToWork") || ""));
    if (visaStatus === "Other") {
      payload.set("entry.1358855147", "__other_option__");
      payload.set("entry.1358855147.other_option_response", String(form.get("otherVisa") || ""));
    } else {
      payload.set("entry.1358855147", visaStatus);
    }

    coverage.forEach((area) => {
      payload.append("entry.1260522230", area === "Other" ? "__other_option__" : area);
    });
    if (coverage.includes("Other")) payload.set("entry.1260522230.other_option_response", String(form.get("otherCoverage") || ""));

    travel.forEach((method) => {
      payload.append("entry.766761908", method === "Other" ? "__other_option__" : method);
    });
    if (travel.includes("Other")) payload.set("entry.766761908.other_option_response", String(form.get("otherTravel") || ""));

    payload.set("fvv", "1");
    payload.set("pageHistory", "0");

    setIsSubmitting(true);
    setStatus("Submitting your application...");
    setStatusType("idle");

    try {
      await fetch(googleFormResponseUrl, { method: "POST", mode: "no-cors", body: payload, keepalive: true });
      formElement.reset();
      setAvailability(createInitialAvailability());
      setVisaStatus("");
      setCoverage([]);
      setTravel([]);
      setCurrentStep(1);
      setStatus("Thank you for applying to Coreserve. Your application has been submitted successfully. Our team will review your application and contact you using the details you provided.");
      setStatusType("success");
    } catch {
      setStatus("We could not submit your application. Please check your connection and try again.");
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form ref={formRef} className="cleaner-application-form multi-step-form" onSubmit={handleSubmit} noValidate>
      <div className="cleaner-application-form__heading">
        <div>
          <span className="eyebrow eyebrow--compact">Cleaner application · Step {currentStep} of {steps.length}</span>
          <h2>{activeStep.title}</h2>
          <p>{activeStep.description}</p>
        </div>
        <span className="secure-note"><CheckCircle2 size={18} /> Secure application</span>
      </div>

      <ol className="form-progress" aria-label="Application progress">
        {steps.map((step) => {
          const state = step.number < currentStep ? "complete" : step.number === currentStep ? "current" : "upcoming";
          return (
            <li key={step.number} className={`is-${state}`} aria-current={state === "current" ? "step" : undefined}>
              <span>{state === "complete" ? <Check size={15} /> : step.number}</span>
              <strong>{step.label}</strong>
            </li>
          );
        })}
      </ol>

      <section className="form-step" data-form-step="1" hidden={currentStep !== 1} aria-label="Personal details">
        <div className="form-grid">
          <label className="form-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
          <label><span>Full name *</span><input name="name" autoComplete="name" required placeholder="Your full name" /></label>
          <label><span>Email address *</span><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
          <label><span>Contact / WhatsApp number *</span><input name="phone" type="tel" autoComplete="tel" required placeholder="Your best contact number" /></label>
          <label><span>Home address *</span><input name="address" autoComplete="street-address" required placeholder="Address, town and postcode" /></label>
        </div>
      </section>

      <section className="form-step" data-form-step="2" hidden={currentStep !== 2} aria-label="Work availability">
        <fieldset className="application-fieldset">
          <legend>Normal work availability *</legend>
          <p>Select every time slot you are usually available. You can choose multiple times on each day.</p>
          <div className="availability-table">
            <div className="availability-table__head" aria-hidden="true"><span>Day</span>{timeSlots.map((slot) => <span key={slot}>{slot}</span>)}</div>
            {days.map((day) => (
              <div className="availability-table__row" key={day.label}>
                <strong>{day.label}</strong>
                {timeSlots.map((slot) => (
                  <label key={slot} title={`${day.label} ${slot}`}>
                    <input type="checkbox" checked={availability[day.label].includes(slot)} onChange={() => toggleAvailability(day.label, slot)} />
                    <span><span className="availability-table__mobile-label">{slot}</span><Check size={14} aria-hidden="true" /></span>
                  </label>
                ))}
              </div>
            ))}
          </div>
          <small>{selectedAvailabilityCount} time {selectedAvailabilityCount === 1 ? "slot" : "slots"} selected</small>
        </fieldset>
      </section>

      <section className="form-step" data-form-step="3" hidden={currentStep !== 3} aria-label="Eligibility, areas and travel">
        <div className="application-field-groups">
          <fieldset className="application-fieldset">
            <legend>Do you currently have the legal right to work in the UK? *</legend>
            <div className="choice-grid choice-grid--compact">
              {["Yes", "No"].map((option) => <label className="choice-card" key={option}><input type="radio" name="rightToWork" value={option} onChange={clearStatus} /><span>{option}</span></label>)}
            </div>
          </fieldset>

          <fieldset className="application-fieldset">
            <legend>Current UK visa or immigration status *</legend>
            <div className="choice-grid">
              {visaOptions.map((option) => <label className="choice-card" key={option}><input type="radio" name="visaStatus" value={option} checked={visaStatus === option} onChange={() => { setVisaStatus(option); clearStatus(); }} /><span>{option}</span></label>)}
            </div>
            {visaStatus === "Other" && <label className="application-other-field"><span>Please specify *</span><input name="otherVisa" required placeholder="Enter your status" /></label>}
          </fieldset>

          <fieldset className="application-fieldset">
            <legend>Which towns, postcodes or areas can you cover? *</legend>
            <p>Select all that apply.</p>
            <div className="choice-grid choice-grid--three">
              {coverageOptions.map((option) => <label className="choice-card" key={option}><input type="checkbox" checked={coverage.includes(option)} onChange={() => toggleListItem(option, setCoverage)} /><span>{option}</span></label>)}
            </div>
            {coverage.includes("Other") && <label className="application-other-field"><span>Other town, postcode or area *</span><input name="otherCoverage" required placeholder="Enter another location" /></label>}
          </fieldset>

          <fieldset className="application-fieldset">
            <legend>How can you travel to cleaning jobs? *</legend>
            <p>Select all that apply.</p>
            <div className="choice-grid">
              {travelOptions.map((option) => <label className="choice-card" key={option}><input type="checkbox" checked={travel.includes(option)} onChange={() => toggleListItem(option, setTravel)} /><span>{option}</span></label>)}
            </div>
            {travel.includes("Other") && <label className="application-other-field"><span>Other means of travel *</span><input name="otherTravel" required placeholder="Enter your travel method" /></label>}
          </fieldset>

          <label className="consent-field"><input name="privacy" type="checkbox" /><span>I agree that my application details may be used to assess suitable work opportunities, as described in the <Link href="/privacy">privacy notice</Link>.</span></label>
        </div>
      </section>

      <div className="cleaner-application-form__footer">
        <div className="form-step-actions">
          {currentStep > 1 && <button className="button button--secondary" type="button" onClick={() => changeStep(currentStep - 1)}><ArrowLeft size={18} /> Back</button>}
          {currentStep < steps.length
            ? <button className="button button--primary" type="button" onClick={goToNextStep}>Continue <ArrowRight size={18} /></button>
            : <button className="button button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="button-spinner" size={18} /> : <Send size={18} />}{isSubmitting ? "Submitting..." : "Submit application"}</button>}
        </div>
        <p className={statusType === "idle" ? undefined : `form-status form-status--${statusType}`} aria-live="polite">{status || (currentStep < 3 ? "Your answers stay in place while you complete the steps." : "Review your answers before submitting.")}</p>
      </div>
    </form>
  );
}

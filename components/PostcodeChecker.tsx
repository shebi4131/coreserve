"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Search, XCircle } from "lucide-react";
import { serviceAreas } from "@/lib/areas";

type PostcodeCheckerProps = {
  areaSlug?: string;
  heading?: string;
};

type CheckResult = {
  status: "covered" | "outside" | "invalid";
  message: string;
  areaSlug?: string;
  areaName?: string;
};

function normalisePostcode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function postcodeArea(value: string) {
  return normalisePostcode(value).match(/^[A-Z]{1,2}/)?.[0] || "";
}

export function PostcodeChecker({ areaSlug, heading = "Check your postcode" }: PostcodeCheckerProps) {
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalised = normalisePostcode(postcode);
    const outwardArea = postcodeArea(postcode);

    if (normalised.length < 2 || !outwardArea) {
      setResult({ status: "invalid", message: "Enter a UK postcode or outward code, for example PR1, M1, L1 or SW1." });
      return;
    }

    const preferredArea = areaSlug ? serviceAreas.find((area) => area.slug === areaSlug) : undefined;
    const matches = serviceAreas.filter((area) => area.postcodeAreas.includes(outwardArea));
    const match = preferredArea && matches.some((area) => area.slug === preferredArea.slug) ? preferredArea : matches[0];

    if (match) {
      setResult({
        status: "covered",
        areaSlug: match.slug,
        areaName: match.name,
        message: `This postcode is within our ${match.name} enquiry area. Final availability is confirmed after we review the property, service and required date.`,
      });
      return;
    }

    setResult({
      status: "outside",
      message: "This postcode is outside the four priority areas shown here, but national enquiries are still welcome and assessed individually.",
    });
  }

  return (
    <div className="postcode-checker" id="coverage-checker">
      <div className="postcode-checker__heading">
        <span className="postcode-checker__icon"><MapPin size={21} /></span>
        <div><span>Coverage finder</span><h2>{heading}</h2></div>
      </div>
      <p>Enter a full postcode or the first part. We will identify the closest priority service area.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor={`postcode-${areaSlug || "all"}`}>Property postcode</label>
        <div className="postcode-checker__field">
          <Search size={19} aria-hidden="true" />
          <input
            id={`postcode-${areaSlug || "all"}`}
            value={postcode}
            onChange={(event) => { setPostcode(event.target.value); setResult(null); }}
            placeholder="For example, PR1 1AA"
            autoComplete="postal-code"
          />
          <button type="submit">Check</button>
        </div>
      </form>
      {result ? (
        <div className={`postcode-result postcode-result--${result.status}`} role="status" aria-live="polite">
          {result.status === "covered" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <div>
            <strong>{result.status === "covered" ? `${result.areaName} coverage found` : result.status === "invalid" ? "Check the postcode" : "Outside a priority area"}</strong>
            <p>{result.message}</p>
            {result.status === "covered" && result.areaSlug ? <Link href={`/areas-we-cover/${result.areaSlug}`}>View {result.areaName} coverage <ArrowRight size={16} /></Link> : null}
            {result.status === "outside" ? <Link href="/contact">Ask about national coverage <ArrowRight size={16} /></Link> : null}
          </div>
        </div>
      ) : null}
      <small>Coverage and booking remain subject to scope, location and team availability.</small>
    </div>
  );
}

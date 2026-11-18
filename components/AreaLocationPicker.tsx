"use client";

import { MapPin } from "lucide-react";

type AreaLocationPickerProps = {
  locations: readonly { name: string; postcode: string }[];
};

export function AreaLocationPicker({ locations }: AreaLocationPickerProps) {
  function selectLocation(name: string, postcode: string) {
    const location = `${name} — ${postcode}`;
    const url = new URL(window.location.href);
    url.searchParams.set("location", location);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new CustomEvent("coreserve:location-selected", { detail: { location } }));
    document.querySelector("#quote-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="area-location-grid">
      {locations.map((location) => (
        <button type="button" key={location.name} onClick={() => selectLocation(location.name, location.postcode)}>
          <span><MapPin size={18} /><strong>{location.name}</strong></span>
          <small>{location.postcode} area</small>
        </button>
      ))}
    </div>
  );
}

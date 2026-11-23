export const siteConfig = {
  name: "Coreserve Facilities Group",
  shortName: "Coreserve",
  legalName: "Coreserve Facilities Group Ltd",
  description:
    "Domestic, commercial, deep, end-of-tenancy and Airbnb cleaning from Coreserve Facilities Group, with our own teams across Lancashire, Manchester, Merseyside and London.",
  phoneDisplay: "0330 111 9592",
  phoneHref: "tel:03301119592",
  phoneInternational: "+44 330 111 9592",
  whatsappNumber: "443301119592",
  social: {
    instagram: "https://www.instagram.com/coreserve_group/",
    facebook: "https://www.facebook.com/profile.php?id=61596391760517",
    whatsapp: "https://wa.me/443301119592",
    trustpilot: "https://uk.trustpilot.com/review/coreservegroup.co.uk",
  },
  address: {
    street: "124 Colne Road",
    locality: "Burnley",
    region: "England",
    postcode: "BB10 1LP",
    country: "GB",
  },
  maps: {
    embed: "https://www.google.com/maps?q=124%20Colne%20Road%2C%20Burnley%2C%20England%2C%20BB10%201LP&output=embed",
    directions: "https://www.google.com/maps/dir/?api=1&destination=124%20Colne%20Road%2C%20Burnley%2C%20England%2C%20BB10%201LP",
    businessProfile: "https://www.google.com/maps?cid=18308218644608467039",
  },
  coverage: {
    short: "Across the UK",
    regions: "Lancashire, Greater Manchester, Merseyside & London",
    sentence: "We clean homes and businesses across the UK, with our own teams in Lancashire, Greater Manchester, Merseyside and London.",
  },
  // Confirmed service commitments. Only add items that are true today.
  commitments: {
    completionPhotos: true,
    sameDaySummary: true,
  },
  // Leave empty until confirmed; anything empty is hidden on the site.
  businessHours: "",
  quoteResponseTime: "",
  founderName: "",
  foundedYear: "",
  trustpilotRating: "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export function canonicalUrl(path = "/") {
  const baseUrl = `${siteConfig.siteUrl.replace(/\/+$/, "")}/`;
  const url = new URL(path, baseUrl);
  const lastSegment = url.pathname.split("/").filter(Boolean).at(-1) || "";

  if (!url.pathname.endsWith("/") && !lastSegment.includes(".")) {
    url.pathname = `${url.pathname}/`;
  }

  return url.toString();
}

export const siteConfig = {
  name: "Coreserve Facilities Group",
  shortName: "Coreserve",
  description:
    "Professional domestic, commercial, deep and end-of-tenancy cleaning from Coreserve Facilities Group, based in North-West England with wider UK coverage subject to location and availability.",
  phoneDisplay: "0330 111 9592",
  phoneHref: "tel:03301119592",
  whatsappNumber: "443301119592",
  social: {
    instagram: "https://www.instagram.com/coreserve_/?hl=en",
    facebook: "https://www.facebook.com/profile.php?id=61595439074278",
    whatsapp: "https://wa.me/443301119592",
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
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

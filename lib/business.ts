/**
 * Single source of truth for every business fact on the site.
 *
 * ⚠️  PLACEHOLDER values are marked `NEEDS_REAL_VALUE`. Replace them here and
 * they update everywhere — header, footer, schema.org markup, city pages,
 * quote-form emails. Do not hardcode a phone number anywhere else.
 *
 * ⚠️  WASHINGTON LAW: RCW 18.27.200 requires a registered contractor to display
 * its L&I registration number in ALL advertising, including websites. The site
 * renders `license.lni` in the footer; leaving it as a placeholder is a
 * compliance problem, not a cosmetic one.
 */

export const NEEDS_REAL_VALUE = true;

export const business = {
  legalName: "J.C.K. HomeFix LLC",
  name: "JCK HomeFix America",
  shortName: "JCK HomeFix",
  tagline: "24/7 Water Damage Restoration in Arlington, WA",
  description:
    "Emergency water damage restoration for Arlington and Snohomish County homes and businesses. Water extraction, structural drying, mold prevention, and flood cleanup — on site fast, any hour.",

  // ---- CONTACT — all placeholders until confirmed -------------------------
  phone: {
    // Digits only, used for tel: links
    raw: "3605550142", // NEEDS_REAL_VALUE
    display: "(360) 555-0142", // NEEDS_REAL_VALUE
  },
  email: "info@jckhomefixamerica.com", // NEEDS_REAL_VALUE
  address: {
    street: "", // NEEDS_REAL_VALUE — omit entirely if they work from home
    city: "Arlington",
    state: "WA",
    stateName: "Washington",
    zip: "98223", // NEEDS_REAL_VALUE
    country: "US",
  },
  // Arlington, WA coordinates — refine if a real street address is confirmed
  geo: { lat: 48.1987, lng: -122.1251 },

  // ---- CREDENTIALS -------------------------------------------------------
  license: {
    lni: "JCKHOL***", // NEEDS_REAL_VALUE — WA L&I contractor registration #
    ubi: "", // NEEDS_REAL_VALUE — WA UBI number
    bonded: true,
    insured: true,
    iicrc: false, // set true only if actually IICRC certified
  },

  founded: 2019, // NEEDS_REAL_VALUE

  hours: {
    emergency: "24 hours a day, 7 days a week",
    office: "Mon–Fri, 8:00am – 6:00pm",
  },

  responseTime: "60–90 minutes", // NEEDS_REAL_VALUE — verify before publishing
  warranty: "12-month workmanship guarantee",

  social: {
    facebook: "", // NEEDS_REAL_VALUE
    google: "", // NEEDS_REAL_VALUE — Google Business Profile URL
    instagram: "",
  },

  url: "https://jckhomefixamerica.com",
} as const;

export const telHref = `tel:+1${business.phone.raw}`;

/** Formatted one-line address, skipping any part we don't have yet. */
export const addressLine = [
  business.address.street,
  business.address.city,
  `${business.address.state} ${business.address.zip}`.trim(),
]
  .filter(Boolean)
  .join(", ");

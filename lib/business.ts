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

/**
 * Master switch for search-engine indexing.
 *
 * FALSE while the site still advertises a placeholder phone number and an
 * unconfirmed L&I registration. Flip to `true` at launch — it drives both the
 * `robots` meta tag (app/layout.tsx) and /robots.txt (app/robots.ts), so this
 * one line is the whole toggle.
 */
export const allowIndexing = false;

export const business = {
  legalName: "J.C.K. HomeFix LLC",
  name: "JCK HomeFix America",
  shortName: "JCK HomeFix",
  tagline: "24/7 Water Damage Restoration in Arlington, WA",
  description:
    "Emergency water damage restoration for Arlington and Snohomish County homes and businesses. Water extraction, structural drying, mold prevention, and flood cleanup — on site fast, any hour.",

  /** Owner. Surname still unconfirmed — ask before publishing a full name. */
  owner: { firstName: "Curtis" },

  // ---- CONTACT ------------------------------------------------------------
  /**
   * Confirmed 2026-08-27. Digits only in `raw`, used for tel: links.
   *
   * Note for whoever edits this next: 947 is a Michigan area code (Oakland
   * County overlay on 248), not a Washington one. That is fine and dials
   * correctly — plenty of people keep a cell number after moving — but it does
   * sit slightly against the "we are local" positioning, so if a 360 or 425
   * number is ever acquired, switch to it here.
   */
  phone: {
    raw: "9477774276",
    display: "(947) 777-4276",
  },
  /** Confirmed 2026-08-27. Where quote-request notifications are delivered. */
  email: "curtis.jckhomefix@gmail.com",
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
  //
  // ⚠️ UNRESOLVED. On 2026-08-27 the full WA L&I contractor registry
  // (data.wa.gov dataset m8qx-ubtq) was searched for "HOMEFIX", "HOME FIX",
  // "JCK", and every Arlington-area contractor with a principal named Curtis.
  // J.C.K. HomeFix LLC does not appear. Either the registration is too recent
  // for the dataset, it is held under a different legal name, or it does not
  // exist yet.
  //
  // RCW 18.27.020 requires registration to ADVERTISE contracting work, and the
  // reconstruction this site advertises (drywall, flooring, trim) is
  // contracting. Do not launch publicly until this is confirmed real.
  license: {
    lni: "", // NEEDS_REAL_VALUE — verify at secure.lni.wa.gov/verify
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

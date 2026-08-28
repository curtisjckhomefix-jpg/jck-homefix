export type ProjectPhoto = {
  /** Cloudinary public ID, e.g. "jck/projects/marysville-burst-line/before" */
  publicId: string;
  /** Describe the DAMAGE, not the marketing. Screen readers and SEO both win. */
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  city: string;
  service: string;
  /** What went wrong, in one or two sentences. */
  situation: string;
  /** What was actually done. */
  work: string;
  /** Days from first call to dry standard. */
  days?: number;
  before: ProjectPhoto;
  after: ProjectPhoto;
};

/**
 * ⚠️  INTENTIONALLY EMPTY — needs real job photos.
 *
 * Before/after images on a contractor site are advertising claims about work
 * this company actually performed. Stock photos, or another company's job
 * photos, would be deceptive advertising — so nothing ships until there are
 * real ones.
 *
 * ── How to add one ────────────────────────────────────────────────────────
 * 1. Upload the pair to Cloudinary under
 *      jck/projects/<slug>/before
 *      jck/projects/<slug>/after
 *    Phone photos are fine. For this trade they read as MORE trustworthy than
 *    styled photography — people believe a slightly crooked shot of a wet
 *    subfloor far more than a lit studio image.
 * 2. Get the homeowner's OK before publishing anything recognisable, and keep
 *    house numbers, plates, mail and family photos out of frame.
 * 3. Add an entry below. Shoot before/after from the SAME position — a pair
 *    taken from different angles reads as a trick and undercuts the point.
 *
 * Example, once photos exist:
 *
 *   {
 *     slug: "marysville-burst-line",
 *     title: "Burst supply line, upstairs bathroom",
 *     city: "Marysville",
 *     service: "Emergency Water Extraction",
 *     situation: "Second-floor supply line let go overnight...",
 *     work: "Extracted, removed wet insulation, dried the cavity...",
 *     days: 4,
 *     before: {
 *       publicId: "jck/projects/marysville-burst-line/before",
 *       alt: "Buckled hallway hardwood with standing water at the baseboard",
 *     },
 *     after: {
 *       publicId: "jck/projects/marysville-burst-line/after",
 *       alt: "The same hallway after drying, with replaced flooring and trim",
 *     },
 *   }
 */
export const projects: Project[] = [];

export const hasProjects = projects.length > 0;

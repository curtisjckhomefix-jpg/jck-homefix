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
  before: { src: string; alt: string };
  after: { src: string; alt: string };
};

/**
 * ⚠️  INTENTIONALLY EMPTY — needs real job photos.
 *
 * Before/after images on a contractor site are advertising claims about work
 * this company actually performed. Stock photos or another company's job
 * photos used here are deceptive advertising, so nothing ships until there are
 * real ones.
 *
 * To fill it:
 *   1. Collect before/after pairs from completed jobs. Phone photos are fine —
 *      visitors trust them more than staged photography for this trade.
 *   2. Get the homeowner's OK before publishing anything recognisable, and do
 *      not include house numbers, plates, or anything identifying.
 *   3. Drop the files in /public/projects/ and add entries below.
 *
 * Good alt text describes the damage, not the marketing: "Buckled hardwood in
 * a hallway with standing water at the baseboard" beats "water damage before".
 */
export const projects: Project[] = [];

export const hasProjects = projects.length > 0;

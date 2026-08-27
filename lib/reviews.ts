export type Review = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date string. */
  date: string;
  text: string;
  city?: string;
  service?: string;
  source: "google" | "direct" | "facebook";
};

/**
 * ⚠️  INTENTIONALLY EMPTY.
 *
 * No invented testimonials ship on this site. Fabricated reviews are an FTC
 * problem (16 CFR Part 465, in force since 2024) and carry real civil penalty
 * exposure — not a stylistic preference.
 *
 * Two ways to fill this:
 *
 *  1. Paste real reviews you have permission to quote, in the shape above.
 *  2. Better: auto-import from the Google Business Profile via the Places API
 *     (New) v1, the same pattern used on the MRA site. Set GOOGLE_PLACES_API_KEY
 *     and GOOGLE_PLACE_ID, then have a cron route refresh them. Google's own
 *     reviews carry more weight with visitors than anything self-hosted, and
 *     they cannot be accused of being made up.
 *
 * Until this array has entries, the reviews UI renders an honest empty state
 * rather than filler. That is deliberate — do not "temporarily" add fake ones.
 */
export const reviews: Review[] = [];

export const hasReviews = reviews.length > 0;

export const averageRating = hasReviews
  ? Math.round(
      (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10,
    ) / 10
  : null;

export const featuredReviews = reviews.slice(0, 3);

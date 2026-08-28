/**
 * Cloudinary configuration and folder convention.
 *
 * Only the CLOUD NAME is public. The API key and secret are server-only and
 * are never imported into a client component — the upload widget uses an
 * UNSIGNED preset instead, so no secret ever reaches the browser.
 *
 * ── Folder convention ─────────────────────────────────────────────────────
 *   jck/projects/<slug>/before      before/after pairs for /gallery
 *   jck/projects/<slug>/after
 *   jck/team/                       Curtis, crew, trucks
 *   jck/equipment/                  air movers, dehumidifiers, meters
 *   jck/hero/                       wide shots for page headers
 *
 * Keeping everything under `jck/` means a future second site on the same
 * Cloudinary account cannot collide with these assets.
 */

export const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

/** Unsigned preset used by the admin upload widget, if one is configured. */
export const uploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export const isCloudinaryConfigured = Boolean(cloudName);

export const folders = {
  projects: "jck/projects",
  team: "jck/team",
  equipment: "jck/equipment",
  hero: "jck/hero",
} as const;

/**
 * Build a delivery URL for a public ID.
 *
 * `f_auto,q_auto` lets Cloudinary pick format and quality per browser, which
 * is the single biggest win on phone photos. `c_limit` never upscales — a
 * 900px-wide phone shot stays 900px rather than being blown up and going soft.
 */
export function cloudinaryUrl(
  publicId: string,
  opts: { width?: number; height?: number; crop?: "limit" | "fill" | "thumb" } = {},
) {
  if (!cloudName) return "";
  const { width, height, crop = "limit" } = opts;

  const transforms = [
    "f_auto",
    "q_auto",
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
    `c_${crop}`,
    crop === "fill" || crop === "thumb" ? "g_auto" : null,
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
}

/** Low-quality blurred placeholder, for `blurDataURL` on next/image. */
export function cloudinaryBlur(publicId: string) {
  if (!cloudName) return undefined;
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_24,q_10,e_blur:400,f_auto/${publicId}`;
}

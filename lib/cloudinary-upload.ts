import { createHash } from "node:crypto";

/**
 * Server-side Cloudinary signing.
 *
 * The browser uploads DIRECTLY to Cloudinary using a signature minted here.
 * Two reasons this is worth the extra step over posting the file to our own
 * API route:
 *
 *  · Vercel serverless functions cap request bodies at ~4.5MB. A photo
 *    straight off a phone routinely exceeds that, so proxying would fail on
 *    exactly the files this feature exists to handle.
 *  · The API secret stays on the server. Only a short-lived signature for one
 *    specific folder ever reaches the browser.
 *
 * Requires CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (server-only — never
 * prefix these with NEXT_PUBLIC_).
 */

export const uploadCloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const apiKey = process.env.CLOUDINARY_API_KEY ?? "";
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";

export const isUploadConfigured = Boolean(
  uploadCloudName && apiKey && apiSecret,
);

/** Folders the admin is allowed to upload into. Anything else is rejected. */
export const ALLOWED_FOLDERS = [
  "jck/brand",
  "jck/projects",
  "jck/team",
  "jck/equipment",
  "jck/hero",
] as const;

export type UploadFolder = (typeof ALLOWED_FOLDERS)[number];

export type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

/**
 * Cloudinary signs the SHA-1 of the alphabetically-sorted parameter string
 * plus the API secret. Any parameter sent with the upload must be included
 * here or Cloudinary rejects it, which is the usual cause of a 401 on this
 * endpoint.
 */
export function signUpload(folder: string): UploadSignature {
  if (!isUploadConfigured) {
    throw new Error("Cloudinary upload is not configured");
  }
  if (!(ALLOWED_FOLDERS as readonly string[]).includes(folder)) {
    throw new Error(`Folder not allowed: ${folder}`);
  }

  const timestamp = Math.floor(Date.now() / 1000);

  const params: Record<string, string | number> = { folder, timestamp };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const signature = createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return { cloudName: uploadCloudName, apiKey, timestamp, folder, signature };
}

/**
 * Permanently delete an asset. Used when replacing the logo or removing a
 * project, so orphaned images do not accumulate in the account.
 */
export async function destroyAsset(publicId: string): Promise<boolean> {
  if (!isUploadConfigured || !publicId) return false;

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
  });

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${uploadCloudName}/image/destroy`,
      { method: "POST", body },
    );
    const data = (await res.json()) as { result?: string };
    return data.result === "ok";
  } catch (err) {
    console.error("[cloudinary] destroy failed:", err);
    return false;
  }
}

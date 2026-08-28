import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { signUpload, isUploadConfigured } from "@/lib/cloudinary-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mint a short-lived Cloudinary upload signature for the admin.
 *
 * Gated on the admin session — without this check anyone could mint
 * signatures and upload into the account. The folder is validated against an
 * allowlist inside signUpload(), so a crafted request cannot write outside
 * the jck/ namespace.
 */
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  if (!isUploadConfigured) {
    return NextResponse.json(
      {
        error:
          "Cloudinary upload is not configured. Set CLOUDINARY_API_KEY and " +
          "CLOUDINARY_API_SECRET in Vercel, then redeploy.",
      },
      { status: 503 },
    );
  }

  let folder = "jck/projects";
  try {
    const body = (await req.json()) as { folder?: string };
    if (body.folder) folder = body.folder;
  } catch {
    /* default folder */
  }

  try {
    return NextResponse.json(signUpload(folder));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not sign upload." },
      { status: 400 },
    );
  }
}

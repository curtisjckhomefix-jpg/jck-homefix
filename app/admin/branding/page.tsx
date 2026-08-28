import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { LogoForm } from "./logo-form";
import { getSetting } from "@/lib/db";
import { isUploadConfigured } from "@/lib/cloudinary-upload";

export const metadata: Metadata = {
  title: "Branding",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function BrandingPage() {
  const [logoPublicId, logoAlt] = await Promise.all([
    getSetting("logo_public_id"),
    getSetting("logo_alt"),
  ]);

  return (
    <AdminShell
      title="Branding"
      intro="Upload a logo to use in the header and footer. Leave it empty and the site falls back to the built-in JCK badge, which is drawn in CSS and costs no extra request."
    >
      {!isUploadConfigured ? (
        <div className="mb-8 border-2 border-siren-500 p-6">
          <h2 className="font-display text-xl uppercase tracking-tight text-siren-500">
            Uploads are not configured
          </h2>
          <p className="mt-3 leading-relaxed text-carbon-300">
            Set{" "}
            <code className="font-mono text-hivis-400">CLOUDINARY_API_KEY</code>{" "}
            and{" "}
            <code className="font-mono text-hivis-400">
              CLOUDINARY_API_SECRET
            </code>{" "}
            in Vercel, then redeploy. Both are server-only — do NOT prefix them
            with <code className="font-mono">NEXT_PUBLIC_</code>.
          </p>
        </div>
      ) : null}

      <LogoForm initialPublicId={logoPublicId} initialAlt={logoAlt ?? ""} />
    </AdminShell>
  );
}

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
      intro="Replaces the wordmark in the site header and footer. Leave it empty and the site falls back to the built-in JCK badge, drawn in CSS at no extra request."
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

      <div className="mb-8 border-l-2 border-hivis-400 pl-5">
        <p className="leading-relaxed text-carbon-300">
          A <strong className="text-paper-50">wide, horizontal</strong> logo
          works best — it replaces the whole header lockup, so a square mark
          renders small beside the navigation. There is a ready-made lockup in
          the repo at{" "}
          <code className="font-mono text-hivis-400">
            public/brand/jck-lockup-dark.png
          </code>
          .
        </p>
        <p className="mt-3 leading-relaxed text-carbon-300">
          Use a transparent PNG or a light-on-dark image — the header sits on
          near-black.
        </p>
      </div>

      <LogoForm initialPublicId={logoPublicId} initialAlt={logoAlt ?? ""} />
    </AdminShell>
  );
}

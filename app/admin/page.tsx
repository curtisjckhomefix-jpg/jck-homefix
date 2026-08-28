import type { Metadata } from "next";
import { listLeads, leadCounts, isDbConfigured, type Lead } from "@/lib/db";
import { business } from "@/lib/business";
import { isCloudinaryConfigured, cloudName } from "@/lib/cloudinary";
import { isTurnstileConfigured, isTurnstileHalfConfigured } from "@/lib/turnstile";
import { rateLimitBackend } from "@/lib/rate-limit";
import { updateStatus } from "./actions";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false, nocache: true },
};

// Leads must never be served from a cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUSES = ["new", "contacted", "quoted", "won", "lost", "spam"] as const;

const urgencyLabel: Record<string, string> = {
  emergency: "EMERGENCY",
  urgent: "Urgent",
  recent: "Recent",
  ongoing: "Ongoing",
  inspection: "Inspection",
};

/** Answers "is X actually wired up in this environment?" without leaking values. */
function ConfigPanel() {
  const rows = [
    {
      label: "Database (Neon)",
      ok: isDbConfigured,
      detail: isDbConfigured ? "DATABASE_URL set" : "DATABASE_URL missing",
    },
    {
      label: "Email (Resend)",
      ok: Boolean(process.env.RESEND_API_KEY && process.env.QUOTE_FROM_EMAIL),
      detail: process.env.RESEND_API_KEY
        ? process.env.QUOTE_FROM_EMAIL
          ? `from ${process.env.QUOTE_FROM_EMAIL}`
          : "QUOTE_FROM_EMAIL missing"
        : "RESEND_API_KEY missing",
    },
    {
      label: "Images (Cloudinary)",
      ok: isCloudinaryConfigured,
      detail: isCloudinaryConfigured
        ? `cloud: ${cloudName}`
        : "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME missing or marked sensitive",
    },
    {
      label: "Bot protection (Turnstile)",
      ok: isTurnstileConfigured,
      detail: isTurnstileConfigured
        ? "enforcing"
        : isTurnstileHalfConfigured
          ? process.env.TURNSTILE_SECRET_KEY
            ? "HALF-CONFIGURED: site key missing — widget cannot render, so " +
              "enforcement is disabled. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY as " +
              "a PLAIN (non-sensitive) variable, then redeploy."
            : "HALF-CONFIGURED: TURNSTILE_SECRET_KEY missing — widget shows " +
              "but nothing is verified server-side."
          : "not configured — honeypot + time-trap only",
    },
    {
      label: "Rate limiting",
      ok: rateLimitBackend === "upstash",
      detail:
        rateLimitBackend === "upstash"
          ? "Upstash — shared across instances"
          : "in-memory fallback — not shared across serverless instances",
    },
    {
      label: "L&I registration",
      ok: Boolean(business.license.lni),
      detail: business.license.lni || "Not set — required before launch",
    },
  ];

  return (
    <section className="border-2 border-carbon-700">
      <h2 className="stamp border-b-2 border-carbon-700 px-5 py-3 text-carbon-400">
        System status
      </h2>
      <dl className="divide-y divide-carbon-800">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-3 px-5 py-3.5">
            <span
              aria-hidden="true"
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 ${r.ok ? "bg-hivis-400" : "bg-siren-500"}`}
            />
            {/* min-w-0 lets the long env-var names wrap instead of blowing
                out the panel width */}
            <div className="min-w-0 flex-1">
              <dt className="text-sm text-paper-100">{r.label}</dt>
              <dd
                className={`mt-1 break-words font-mono text-xs ${r.ok ? "text-carbon-400" : "text-siren-500"}`}
              >
                {r.detail}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const emergency = lead.urgency === "emergency";
  const when = new Date(lead.created_at).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article
      className={`border-2 ${emergency && lead.status === "new" ? "border-siren-500" : "border-carbon-700"}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-carbon-800 px-5 py-3">
        <span className="stamp text-carbon-500">
          #{lead.id} · {when} PT
        </span>
        <span className="flex items-center gap-2">
          {emergency ? (
            <span className="stamp bg-siren-600 px-2 py-1 text-white">
              {urgencyLabel[lead.urgency ?? ""] ?? lead.urgency}
            </span>
          ) : lead.urgency ? (
            <span className="stamp border border-carbon-700 px-2 py-1 text-carbon-400">
              {urgencyLabel[lead.urgency] ?? lead.urgency}
            </span>
          ) : null}
          {!lead.email_sent ? (
            <span
              className="stamp border border-siren-500 px-2 py-1 text-siren-500"
              title="Stored in the database but the notification email did not send"
            >
              Not emailed
            </span>
          ) : null}
        </span>
      </header>

      <div className="grid gap-6 px-5 py-5 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <h3 className="font-display text-2xl uppercase tracking-tight text-paper-50">
            {lead.name}
          </h3>
          <p className="mt-3">
            <a
              href={`tel:${lead.phone.replace(/\D/g, "")}`}
              className="font-mono text-lg text-hivis-400 underline underline-offset-4"
            >
              {lead.phone}
            </a>
          </p>
          {lead.email ? (
            <p className="mt-1.5">
              <a
                href={`mailto:${lead.email}`}
                className="font-mono text-sm text-carbon-300 underline underline-offset-4"
              >
                {lead.email}
              </a>
            </p>
          ) : null}
          <p className="stamp mt-3 text-carbon-500">
            {lead.city}
            {lead.service ? ` · ${lead.service}` : ""}
          </p>
        </div>

        <div>
          {lead.message ? (
            <p className="whitespace-pre-wrap border-l-2 border-carbon-700 pl-4 text-sm leading-relaxed text-carbon-300">
              {lead.message}
            </p>
          ) : (
            <p className="stamp text-carbon-600">No message</p>
          )}
        </div>
      </div>

      <footer className="flex flex-wrap items-center gap-2 border-t border-carbon-800 px-5 py-3">
        <span className="stamp mr-2 text-carbon-500">Status</span>
        {STATUSES.map((s) => (
          <form key={s} action={updateStatus}>
            <input type="hidden" name="id" value={lead.id} />
            <input type="hidden" name="status" value={s} />
            <button
              type="submit"
              className={`stamp border px-2.5 py-1 transition-colors ${
                lead.status === s
                  ? "border-hivis-400 bg-hivis-400 text-carbon-950"
                  : "border-carbon-700 text-carbon-400 hover:border-hivis-400 hover:text-hivis-400"
              }`}
            >
              {s}
            </button>
          </form>
        ))}
      </footer>
    </article>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ spam?: string }>;
}) {
  // ---- Authenticated ------------------------------------------------------
  const { spam } = await searchParams;
  const includeSpam = spam === "1";

  let leads: Lead[] = [];
  let counts: Record<string, number> = {};
  let dbError: string | null = null;

  try {
    [leads, counts] = await Promise.all([listLeads(includeSpam), leadCounts()]);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Unknown database error";
  }

  return (
    <AdminShell
      title="Leads"
      intro={`${counts.new ?? 0} new · ${leads.length} shown · ${Object.values(counts).reduce((a, b) => a + b, 0)} total`}
      actions={
        <a
          href={includeSpam ? "/admin" : "/admin?spam=1"}
          className="stamp border border-carbon-700 px-3 py-2 text-carbon-400 transition-colors hover:border-hivis-400 hover:text-hivis-400"
        >
          {includeSpam ? "Hide spam" : "Show spam"}
        </a>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          {dbError ? (
            <div className="border-2 border-siren-500 p-6">
              <h2 className="font-display text-xl uppercase tracking-tight text-siren-500">
                Database unreachable
              </h2>
              <p className="mt-3 font-mono text-sm text-carbon-300">{dbError}</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="border-2 border-dashed border-carbon-700 p-10 text-center">
              <p className="font-display text-2xl uppercase tracking-tight text-paper-50">
                No leads yet
              </p>
              <p className="mt-3 text-carbon-400">
                Requests from the site will appear here the moment they arrive.
              </p>
            </div>
          ) : (
            leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </div>

        <aside className="space-y-6">
          <ConfigPanel />
        </aside>
      </div>
    </AdminShell>
  );
}

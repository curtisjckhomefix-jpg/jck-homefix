import type { Metadata } from "next";
import { business, telHref } from "@/lib/business";
import { PageHero, Section, Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${business.legalName} handles the information you submit through this website.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

/**
 * Deliberately describes only what this site actually does today. If analytics,
 * a CRM, call tracking, or ad pixels get added later, this page has to be
 * updated in the same change — a privacy policy that describes a different site
 * than the one running is worse than none.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" lead="Short, because we do very little with your data." />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy" }]} />

      <Section tone="carbon">
        <div className="max-w-3xl space-y-10 leading-relaxed text-carbon-300">
          <p className="stamp text-carbon-500">
            Last updated{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>

          <div>
            <h2 className="font-display text-2xl uppercase tracking-tight text-paper-50">
              What we collect
            </h2>
            <p className="mt-3">
              Only what you type into the request form on this site: your name,
              phone number, email address if you provide one, your city, the
              service you are asking about, how urgent it is, and whatever you
              write in the message box.
            </p>
            <p className="mt-3">
              We do not run advertising pixels or third-party trackers on this
              site, and we do not use cookies to profile you.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl uppercase tracking-tight text-paper-50">
              What we do with it
            </h2>
            <p className="mt-3">
              We use it to respond to your request. That is the entire purpose.
              Form submissions are delivered to us by email through Resend, our
              email provider, and this website is hosted by Vercel — both
              necessarily process the data in order to deliver it.
            </p>
            <p className="mt-3">
              We do not sell your information. We do not rent it, trade it, or
              add you to a marketing list because you asked for a quote.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl uppercase tracking-tight text-paper-50">
              How long we keep it
            </h2>
            <p className="mt-3">
              Quote requests stay in our email and job records as long as we need
              them for the work and for our business records. If you want your
              information deleted, ask and we will delete it.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl uppercase tracking-tight text-paper-50">
              Spam protection
            </h2>
            <p className="mt-3">
              The form records how long the page was open before submission and
              includes a hidden field that real visitors never fill in. Both are
              used only to identify automated submissions, and neither is used to
              track you.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl uppercase tracking-tight text-paper-50">
              Questions
            </h2>
            <p className="mt-3">
              Call{" "}
              <a
                href={telHref}
                className="font-mono font-semibold text-hivis-400 underline underline-offset-4"
              >
                {business.phone.display}
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${business.email}`}
                className="font-mono font-semibold text-hivis-400 underline underline-offset-4"
              >
                {business.email}
              </a>
              .
            </p>
            <p className="stamp mt-3 text-carbon-500">
              {business.legalName}, {business.address.city},{" "}
              {business.address.state}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

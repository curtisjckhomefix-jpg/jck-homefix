import type { Metadata } from "next";
import { business, telHref, addressLine } from "@/lib/business";
import { areas } from "@/lib/areas";
import { QuoteForm } from "@/components/quote-form";
import {
  PageHero,
  Section,
  Breadcrumbs,
  CtaBanner,
  SectionHeading,
  Readout,
} from "@/components/ui";
import { Phone, Alert } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us — Free Water Damage Assessment",
  description: `Request a free water damage assessment in ${business.address.city} and Snohomish County, WA. Emergency line answered 24/7.`,
  alternates: { canonical: "/contact" },
};

const preCall = [
  {
    n: "01",
    title: "Shut off the water",
    body: "At the fixture if you can isolate it, at the main if you cannot.",
  },
  {
    n: "02",
    title: "Kill power to wet rooms",
    body: "At the breaker. Never step into standing water in a live room.",
  },
  {
    n: "03",
    title: "Photograph everything",
    body: "Before you move anything. Your adjuster works from these photos.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        stamp="Get in touch"
        title="Free assessment, no obligation"
        lead="Tell us what happened. We will call you back, ask the right questions, and tell you honestly whether this needs a crew or just an eye on it."
      />

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />

      <Section tone="carbon">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {/* Emergency block — siren red is reserved for exactly this */}
            <div className="border-2 border-siren-500">
              <div className="flex items-center gap-3 bg-siren-600 px-6 py-4">
                <Alert className="h-5 w-5 shrink-0 text-white" />
                <h2 className="font-display text-lg uppercase tracking-tight text-white">
                  Emergency? Call, do not type.
                </h2>
              </div>
              <div className="px-6 py-6">
                <p className="leading-relaxed text-carbon-300">
                  If water is actively moving, every minute counts and a form is
                  the slow option. We answer around the clock.
                </p>
                <a
                  href={telHref}
                  className="mt-6 flex items-center justify-center gap-3 bg-hivis-400 px-6 py-5 font-display text-xl uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300"
                >
                  <Phone className="h-5 w-5" />
                  {business.phone.display}
                </a>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="stamp text-carbon-500">Details</h2>
              <div className="mt-5">
                <Readout
                  rows={[
                    { label: "Phone", value: business.phone.display },
                    { label: "Emergency hours", value: "24 / 7 / 365" },
                    { label: "Office hours", value: business.hours.office },
                    { label: "Based in", value: addressLine },
                    {
                      label: "WA L&I reg.",
                      value: business.license.lni || "Pending",
                    },
                  ]}
                />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-carbon-400">
                Serving {areas.map((a) => a.city).join(", ")}, and the
                surrounding Snohomish County area.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <QuoteForm />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeading
          tone="light"
          stamp="Before you call"
          title="Three things worth doing right now"
          lead="These take under two minutes and can meaningfully change what your repair costs."
        />
        <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-3">
          {preCall.map((step) => (
            <li key={step.n} className="border-t-2 border-carbon-950 pt-5">
              <span className="stamp text-carbon-600">{step.n}</span>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-tight text-carbon-950">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-carbon-700">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBanner />
    </>
  );
}

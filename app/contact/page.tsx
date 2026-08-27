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
} from "@/components/ui";
import { Phone, MapPin, Clock, Alert } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us — Free Water Damage Assessment",
  description: `Request a free water damage assessment in ${business.address.city} and Snohomish County, WA. Emergency line answered 24/7.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Free assessment, no obligation"
        lead="Tell us what happened. We will call you back, ask the right questions, and tell you honestly whether this needs a crew or just an eye on it."
      />

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <div className="rounded-2xl border border-alert-500/25 bg-alert-600/5 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-alert-600 text-white">
                <Alert className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-bold text-ink-900">
                Emergency? Call, do not type.
              </h2>
              <p className="mt-2 leading-relaxed text-ink-700">
                If water is actively moving, every minute counts and a form is
                the slow option. We answer around the clock.
              </p>
              <a
                href={telHref}
                className="mt-5 flex items-center justify-center gap-2.5 rounded-xl bg-alert-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-alert-700"
              >
                <Phone className="h-5 w-5" />
                {business.phone.display}
              </a>
            </div>

            {/* dt/dd must be DIRECT children of the wrapping div for the list
                to be valid — the icon lives inside the dt rather than as a
                sibling, which axe (correctly) rejects. */}
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="flex items-center gap-4 font-display text-base font-bold text-ink-900">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-water-100 text-water-700">
                    <Phone className="h-5 w-5" />
                  </span>
                  Phone
                </dt>
                <dd className="mt-2 pl-15">
                  <a
                    href={telHref}
                    className="text-ink-700 underline underline-offset-4 hover:text-water-700"
                  >
                    {business.phone.display}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-4 font-display text-base font-bold text-ink-900">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-water-100 text-water-700">
                    <Clock className="h-5 w-5" />
                  </span>
                  Hours
                </dt>
                <dd className="mt-2 pl-15 text-ink-700">
                  <span className="block">
                    Emergency service: {business.hours.emergency}
                  </span>
                  <span className="block">Office: {business.hours.office}</span>
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-4 font-display text-base font-bold text-ink-900">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-water-100 text-water-700">
                    <MapPin className="h-5 w-5" />
                  </span>
                  Based in
                </dt>
                <dd className="mt-2 pl-15 text-ink-700">{addressLine}</dd>
                <dd className="mt-2 pl-15 text-sm text-ink-600">
                  Serving {areas.map((a) => a.city).join(", ")}, and the
                  surrounding Snohomish County area.
                </dd>
              </div>
            </dl>
          </div>

          <QuoteForm />
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading
          align="center"
          eyebrow="Before you call"
          title="Three things worth doing right now"
          lead="These take under two minutes and can meaningfully change what your repair costs."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            {
              n: "1",
              title: "Shut off the water",
              body: "At the fixture if you can isolate it, at the main if you cannot.",
            },
            {
              n: "2",
              title: "Kill power to wet rooms",
              body: "At the breaker. Never step into standing water in a live room.",
            },
            {
              n: "3",
              title: "Photograph everything",
              body: "Before you move anything. Your adjuster works from these photos.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-sand-200 bg-white p-6 text-center"
            >
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-water-600 font-display text-lg font-bold text-white">
                {step.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}

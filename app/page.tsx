import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { business, telHref } from "@/lib/business";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { hasReviews, featuredReviews, averageRating } from "@/lib/reviews";
import { ArrowRight, Star, Phone } from "@/components/icons";
import {
  Section,
  SectionHeading,
  Stamp,
  CallButton,
  QuoteButton,
  CtaBanner,
  CheckList,
  Readout,
} from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = {
  title: `${business.tagline} | ${business.name}`,
  description: business.description,
  alternates: { canonical: "/" },
};

const triage = [
  {
    step: "Stop the water",
    body: "Shut off at the fixture, or the main if you cannot isolate it.",
  },
  {
    step: "Kill the power",
    body: "Breaker off to any wet room. Never step into standing water in a live room.",
  },
  {
    step: "Photograph everything",
    body: "Before you move anything. Your adjuster works from these.",
  },
  { step: "Call us", body: "We will talk you through the rest on the way." },
];

const process = [
  {
    n: "01",
    title: "You call, a person answers",
    body: "Any hour. Not a call centre, not a voicemail box. We ask what happened, what you can see, and whether it is still running.",
  },
  {
    n: "02",
    title: "We map the real damage",
    body: "Moisture meters and thermal imaging. The wet area is nearly always bigger than the part you can see.",
  },
  {
    n: "03",
    title: "Extract and contain",
    body: "Standing water out first, then containment and equipment placed on the same visit wherever possible.",
  },
  {
    n: "04",
    title: "Dry to a documented standard",
    body: "Readings taken daily until materials match an unaffected baseline. Not a guess. Not a schedule.",
  },
  {
    n: "05",
    title: "Document for the claim",
    body: "Photos, logs and scope in the format adjusters expect. This is what decides whether you get paid in full.",
  },
  {
    n: "06",
    title: "Put the room back",
    body: "Drywall, flooring, paint, trim. You finish with a room, not a dried-out shell and a list of numbers to call.",
  },
];

/**
 * Illustrative drying log. Explicitly labelled as an example — these are not
 * readings from a real customer's job, and must never be presented as such.
 */
const dryingLog = {
  rows: [
    { location: "Subfloor / hall", readings: [42.1, 31.4, 19.8, 11.2] },
    { location: "Base wall / bed 2", readings: [38.6, 24.0, 14.3, 9.6] },
    { location: "Framing / bed 2", readings: [27.3, 19.1, 12.7, 9.1] },
  ],
  standard: 12,
  baseline: 9.0,
};

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="grain blueprint relative overflow-hidden bg-carbon-950">
        <div className="container-page relative pb-20 pt-16 sm:pt-20 lg:pb-28 lg:pt-24">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            {/* Headline column — deliberately overruns the halfway line */}
            <div className="lg:col-span-7">
              <div className="rise" style={{ "--i": 0 } as CSSProperties}>
                <Stamp>
                  Arlington · Snohomish County · Est. {business.founded}
                </Stamp>
              </div>

              <h1
                className="rise mt-7 text-[clamp(3rem,9vw,7rem)] text-paper-50"
                style={{ "--i": 1 } as CSSProperties}
              >
                Water damage
                <br />
                <span className="text-hivis-400">does not wait</span>
                <br />
                for morning.
              </h1>

              <p
                className="rise mt-8 max-w-xl text-lg leading-relaxed text-carbon-300 sm:text-xl"
                style={{ "--i": 2 } as CSSProperties}
              >
                Emergency extraction, structural drying and flood cleanup across
                Snohomish County. Every hour the water sits, the repair gets
                bigger — so call first and sort the details after.
              </p>

              <div
                className="rise mt-10 flex flex-col gap-4 sm:flex-row"
                style={{ "--i": 3 } as CSSProperties}
              >
                <CallButton />
                <QuoteButton />
              </div>

              <div
                className="rise mt-14 max-w-md"
                style={{ "--i": 4 } as CSSProperties}
              >
                <Readout
                  rows={[
                    { label: "Typical arrival", value: business.responseTime },
                    { label: "Phone answered", value: "24 / 7 / 365" },
                    { label: "Workmanship", value: "12-month guarantee" },
                    { label: "WA L&I reg.", value: business.license.lni },
                  ]}
                />
              </div>
            </div>

            {/* Triage panel — hard-edged, offset, breaks the grid downward */}
            <aside
              className="rise lg:col-span-5 lg:mt-16"
              style={{ "--i": 3 } as CSSProperties}
            >
              <div className="border-2 border-hivis-400 bg-carbon-900">
                <div className="flex items-center justify-between gap-4 bg-hivis-400 px-6 py-4">
                  <h2 className="font-display text-xl uppercase tracking-tight text-carbon-950">
                    Water coming in now?
                  </h2>
                  <span className="stamp shrink-0 text-carbon-900">Do this</span>
                </div>

                <ol className="divide-y divide-carbon-800">
                  {triage.map((t, i) => (
                    <li key={t.step} className="flex gap-5 px-6 py-5">
                      <span className="stamp shrink-0 pt-1 text-hivis-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-display text-base uppercase tracking-tight text-paper-50">
                          {t.step}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-carbon-400">
                          {t.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <a
                  href={telHref}
                  className="flex items-center justify-between gap-4 border-t-2 border-carbon-800 px-6 py-5 transition-colors hover:bg-carbon-850"
                >
                  <span>
                    <span className="stamp block text-carbon-500">
                      Emergency line
                    </span>
                    <span className="mt-1 block font-display text-2xl tracking-tight text-hivis-400">
                      {business.phone.display}
                    </span>
                  </span>
                  <Phone className="h-6 w-6 shrink-0 text-hivis-400" />
                </a>
              </div>
            </aside>
          </div>
        </div>
        <div aria-hidden="true" className="hazard-rule" />
      </section>

      {/* ================= SERVICES — index, not cards ================= */}
      <Section tone="carbon">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              stamp="What we do"
              title={
                <>
                  Every stage,
                  <br />
                  one crew.
                </>
              }
              lead="From the moment the water is still moving through to the drywall going back up — so you are not project-managing four contractors during the worst week of your year."
            />
          </div>

          <ul className="lg:col-span-7">
            {services.map((service, i) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-baseline gap-6 border-t border-carbon-700 py-7 transition-colors hover:border-hivis-400 sm:gap-10"
                >
                  <span className="stamp shrink-0 text-carbon-600 transition-colors group-hover:text-hivis-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="font-display text-2xl uppercase tracking-tight text-paper-50 transition-colors group-hover:text-hivis-400 sm:text-3xl">
                        {service.name}
                      </span>
                      {service.emergency ? (
                        <span className="stamp shrink-0 border border-hivis-400/50 px-2 py-0.5 text-hivis-400">
                          24/7
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-2.5 block max-w-xl leading-relaxed text-carbon-400">
                      {service.blurb}
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 self-center text-carbon-600 transition-all group-hover:translate-x-1.5 group-hover:text-hivis-400" />
                </Link>
              </li>
            ))}
            <li aria-hidden="true" className="border-t border-carbon-700" />
          </ul>
        </div>
      </Section>

      {/* ========= THE DIFFERENTIATOR — an actual drying log ========= */}
      <Section tone="carbonDeep" grid>
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              stamp="How you know it is dry"
              title={
                <>
                  We show you
                  <br />
                  the numbers.
                </>
              }
              lead="Anyone can point a fan at a wet floor and come back in three days. Drying is finished when the material matches an unaffected baseline — and the only way you can know that is if someone measures it and hands you the readings."
            />
            <p className="mt-6 leading-relaxed text-carbon-400">
              Ours come to you daily. When the meters hit standard, the equipment
              comes out — not a day later, because it bills by the day.
            </p>
            <div className="mt-9">
              <QuoteButton label="Get an assessment" />
            </div>
          </div>

          {/* Log sheet */}
          <figure className="lg:col-span-7">
            <div className="border-2 border-carbon-700 bg-carbon-900">
              <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-carbon-700 px-5 py-4">
                <span className="stamp text-hivis-400">
                  Drying log — supply line failure
                </span>
                <span className="stamp text-carbon-500">Example record</span>
              </figcaption>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-carbon-700">
                      <th scope="col" className="stamp px-5 py-3 text-carbon-500">
                        Location
                      </th>
                      {["Day 1", "Day 2", "Day 3", "Day 4"].map((d) => (
                        <th
                          key={d}
                          scope="col"
                          className="stamp px-4 py-3 text-right text-carbon-500"
                        >
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dryingLog.rows.map((row) => (
                      <tr
                        key={row.location}
                        className="border-b border-carbon-800"
                      >
                        <th
                          scope="row"
                          className="px-5 py-4 text-sm font-medium text-paper-100"
                        >
                          {row.location}
                        </th>
                        {row.readings.map((v, i) => {
                          const dry = v <= dryingLog.standard;
                          return (
                            <td
                              key={i}
                              className={`px-4 py-4 text-right font-mono text-sm tabular-nums ${
                                dry ? "text-hivis-400" : "text-carbon-300"
                              }`}
                            >
                              {v.toFixed(1)}%{dry ? " ✓" : ""}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-carbon-700 px-5 py-4">
                <span className="stamp text-carbon-500">
                  Dry standard ≤ {dryingLog.standard}%
                </span>
                <span className="stamp text-carbon-500">
                  Unaffected baseline {dryingLog.baseline.toFixed(1)}%
                </span>
                <span className="stamp border border-hivis-400 px-2.5 py-1 text-hivis-400">
                  Released day 4
                </span>
              </div>
            </div>
            <p className="stamp mt-4 text-carbon-600">
              Illustrative figures — not a customer record
            </p>
          </figure>
        </div>
      </Section>

      {/* ================= PROCESS ================= */}
      <Section tone="paper">
        <SectionHeading
          tone="light"
          stamp="Sequence"
          title="What actually happens after you call"
          lead="No mystery, no vague promises. This is the run of work on essentially every job."
        />
        <ol className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {process.map((p) => (
            <li key={p.n} className="border-t-2 border-carbon-950 pt-5">
              <span className="stamp text-carbon-600">{p.n}</span>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-tight text-carbon-950">
                {p.title}
              </h3>
              <p className="mt-3 leading-relaxed text-carbon-700">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ================= INSURANCE ================= */}
      <Section tone="carbon">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              stamp="Insurance claims"
              title={
                <>
                  Claims are lost
                  <br />
                  on paperwork.
                </>
              }
              lead="Most underpaid water damage claims are not underpaid because the damage was small. They are underpaid because nobody documented it properly on day one."
            />
            <p className="mt-6 max-w-xl leading-relaxed text-carbon-400">
              We photograph before we touch anything, log readings daily, and
              write scope the way adjusters expect it. We will talk to your
              adjuster directly if that helps — and if we think your carrier is
              wrong, we will put why in writing.
            </p>
            <div className="mt-9 border-l-2 border-hivis-400 pl-6">
              <p className="leading-relaxed text-paper-100">
                <strong className="font-semibold text-hivis-400">
                  Worth knowing:
                </strong>{" "}
                you choose your restoration contractor, not your insurer. A
                carrier can recommend someone from their vendor programme, but in
                Washington the decision is yours.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="font-display text-xl uppercase tracking-tight text-paper-50">
              What your adjuster gets
            </h3>
            <div className="mt-6">
              <CheckList
                items={[
                  "Dated photographs from before any work started",
                  "Daily moisture readings against an unaffected baseline",
                  "Written scope of work, line-itemed",
                  "Equipment logs — what ran, and for exactly how long",
                  "Cause-of-loss findings, which is what determines coverage",
                  "Final dry-standard verification before reconstruction",
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ================= AREAS ================= */}
      <Section tone="carbonDeep">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              stamp="Coverage"
              title={
                <>
                  Close enough
                  <br />
                  to be useful.
                </>
              }
            />
            <p className="mt-6 leading-relaxed text-carbon-400">
              Local enough to know which streets flood, which neighbourhoods sit
              on crawl spaces, and how long it really takes to get to you.
            </p>
            <p className="mt-6 leading-relaxed text-carbon-400">
              Not on the list? Call anyway. If we cannot reach you in time to
              help, we will say so and point you at someone who can.
            </p>
          </div>

          <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/areas/${area.slug}`}
                  className="group flex items-baseline justify-between gap-4 border-b border-carbon-800 py-4 transition-colors hover:border-hivis-400"
                >
                  <span className="font-display text-lg uppercase tracking-tight text-paper-100 transition-colors group-hover:text-hivis-400">
                    {area.city}
                  </span>
                  <span className="stamp shrink-0 text-carbon-500">
                    {area.eta.replace("under ", "≤ ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ============ REVIEWS — renders only with real data ============ */}
      {hasReviews ? (
        <Section tone="carbon">
          <SectionHeading
            stamp="Reviews"
            title="What neighbours say"
            lead={averageRating ? `${averageRating} of 5 across verified reviews.` : undefined}
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {featuredReviews.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col border-t-2 border-carbon-700 pt-6"
              >
                <div className="flex gap-1 text-hivis-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 leading-relaxed text-carbon-300">
                  {review.text}
                </blockquote>
                <figcaption className="stamp mt-6 text-carbon-500">
                  {review.author}
                  {review.city ? ` · ${review.city}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ================= FORM ================= */}
      <Section tone="paper" id="quote">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="light"
              stamp="No cost, no obligation"
              title="Tell us what happened"
              lead="If water is moving right now, call instead — a form waits for someone to read it, and right now speed is the whole game."
            />
            <div className="mt-9">
              <CallButton />
            </div>
            <div className="mt-12 border-t-2 border-carbon-950 pt-6">
              <h3 className="font-display text-lg uppercase tracking-tight text-carbon-950">
                What happens next
              </h3>
              <div className="mt-5">
                <CheckList
                  tone="light"
                  items={[
                    "We call you back — same day for anything sent before evening",
                    "We ask enough to know whether this needs a crew or just advice",
                    "Free on-site assessment with real moisture readings",
                    "A written scope you can hand straight to your insurer",
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <QuoteForm />
          </div>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}

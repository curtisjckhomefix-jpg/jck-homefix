import Link from "next/link";
import type { Metadata } from "next";
import { business, telHref } from "@/lib/business";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { hasReviews, featuredReviews, averageRating } from "@/lib/reviews";
import { serviceIcons, ArrowRight, Star, Alert, Clock, Shield, MapPin } from "@/components/icons";
import {
  Section,
  SectionHeading,
  CallButton,
  QuoteButton,
  CtaBanner,
  CheckList,
} from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = {
  title: `${business.tagline} | ${business.name}`,
  description: business.description,
  alternates: { canonical: "/" },
};

const emergencySteps = [
  {
    step: "Stop the water",
    body: "Shut off the supply at the fixture, or the main if you cannot isolate it. If it is coming from outside, you cannot stop it — skip to the next step.",
  },
  {
    step: "Kill the power",
    body: "If water is anywhere near outlets, cords, or a panel, shut off the breaker to those rooms. Do not walk into standing water in a live room.",
  },
  {
    step: "Photograph everything",
    body: "Before you move a single thing. Wide shots and close-ups. This is what your insurance adjuster will be working from, and you cannot recreate it later.",
  },
  {
    step: "Call us",
    body: "The clock that matters started when the water did. We will talk you through anything else you should do while we are on the way.",
  },
];

const process = [
  {
    n: "01",
    title: "You call, a person answers",
    body: "Any hour. Not a call center, not a voicemail box. We ask what happened, what you can see, and whether it is still actively leaking.",
  },
  {
    n: "02",
    title: "We get on site and assess",
    body: "Moisture meters and thermal imaging to map how far the water actually went, which is nearly always further than the visible wet area.",
  },
  {
    n: "03",
    title: "Extract and contain",
    body: "Standing water comes out first, then we contain the affected area and get equipment placed the same visit wherever possible.",
  },
  {
    n: "04",
    title: "Dry to a documented standard",
    body: "Air movers and commercial dehumidifiers, with readings taken every day until materials match an unaffected baseline. Not a guess, not a schedule.",
  },
  {
    n: "05",
    title: "Document for your claim",
    body: "Photos, moisture logs, and scope, formatted the way adjusters expect. This is the part that decides whether your claim gets paid in full.",
  },
  {
    n: "06",
    title: "Put it back together",
    body: "Drywall, flooring, paint, and trim, so you finish with a room rather than a dried-out shell and a list of contractors to call.",
  },
];

const trustPoints = [
  {
    icon: Clock,
    title: "Answered 24/7, by us",
    body: "Nights, weekends, holidays. The phone rings to a person who can actually dispatch, not an answering service taking a message for Monday.",
  },
  {
    icon: MapPin,
    title: "Actually local",
    body: `Based in ${business.address.city}, not a franchise dispatching from three counties away. We know which streets flood and which neighborhoods are on crawl spaces.`,
  },
  {
    icon: Shield,
    title: "Licensed, bonded, insured",
    body: "Registered with Washington L&I, and we will hand you the number before you ask so you can verify it yourself.",
  },
  {
    icon: Alert,
    title: "We work your claim with you",
    body: "Documentation built for adjusters, and we talk to them directly if you want us to. Most of what gets denied gets denied on paperwork.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div
          aria-hidden="true"
          className="hero-wash absolute -right-40 -top-52 h-[42rem] w-[42rem] rounded-full bg-water-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-water-800/40 blur-3xl"
        />
        <div className="container-page relative py-16 sm:py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-alert-500/40 bg-alert-600/15 px-3.5 py-1.5 text-sm font-semibold text-alert-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-alert-500" />
                </span>
                Emergency crews available now
              </p>

              <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                Water damage in{" "}
                <span className="text-water-300">{business.address.city}</span>?
                We are on the way.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-200 sm:text-xl">
                24/7 emergency water extraction, structural drying, and flood
                cleanup across Snohomish County. Every hour the water sits, the
                repair gets bigger — so call first and worry about the details
                after.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <CallButton className="text-lg" />
                <QuoteButton variant="light" label="Request an Assessment" />
              </div>

              <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-water-300">
                    On site in
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-bold">
                    {business.responseTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-water-300">
                    Phone answered
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-bold">24/7</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-water-300">
                    Workmanship
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-bold">
                    12-month
                  </dd>
                </div>
              </dl>
            </div>

            {/* Emergency triage card — gives real value before asking for anything */}
            <div className="rounded-2xl border border-ink-800 bg-ink-900/80 p-6 shadow-lift backdrop-blur sm:p-8">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-alert-600 text-white">
                  <Alert className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Water coming in right now?
                  </h2>
                  <p className="mt-1 text-sm text-sand-300">
                    Do these four things in this order.
                  </p>
                </div>
              </div>

              <ol className="mt-6 space-y-5">
                {emergencySteps.map((s, i) => (
                  <li key={s.step} className="flex gap-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-water-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{s.step}</p>
                      <p className="mt-1 text-sm leading-relaxed text-sand-300">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <a
                href={telHref}
                className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-4 text-lg font-bold text-ink-950 transition hover:bg-water-100"
              >
                {business.phone.display}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <Section tone="sand">
        <SectionHeading
          eyebrow="What we do"
          title="Every stage of a water loss, handled by one crew"
          lead="From the moment the water is still moving through to the drywall going back up — so you are not project-managing four different contractors during the worst week of your year."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon] ?? serviceIcons.droplet;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative flex flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-water-300 hover:shadow-lift"
              >
                {service.emergency ? (
                  <span className="absolute right-5 top-5 rounded-full bg-alert-600/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-alert-700">
                    24/7
                  </span>
                ) : null}
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-water-100 text-water-700 transition group-hover:bg-water-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-ink-900">
                  {service.name}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-700">
                  {service.blurb}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-water-700">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ---------------- PROCESS ---------------- */}
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="What actually happens after you call"
          lead="No mystery, no vague promises. This is the sequence on essentially every job we run."
        />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {process.map((p) => (
            <div key={p.n} className="relative">
              <span className="font-display text-5xl font-black text-water-500">
                {p.n}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-ink-900">
                {p.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-ink-700">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- WHY US ---------------- */}
      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="Why homeowners call us"
              title="The restoration company your neighbor actually recommends"
              lead="Water damage brings out the worst in this industry — storm chasers, high-pressure contracts signed while you are panicking, and equipment left running for a week because it bills by the day. We are not that."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallButton />
              <QuoteButton variant="light" label="Get an honest assessment" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="rounded-xl border border-ink-800 bg-ink-900/60 p-5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-water-600/20 text-water-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-sand-300">
                    {point.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ---------------- INSURANCE ---------------- */}
      <Section tone="sand">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Insurance claims"
              title="The paperwork is where claims get lost"
              lead="Most underpaid water damage claims are not underpaid because the damage was small. They are underpaid because nobody documented the damage properly on day one."
            />
            <p className="mt-6 leading-relaxed text-ink-700">
              We photograph before we touch anything, log moisture readings
              daily, and write scope in the format adjusters expect. If it helps,
              we will talk to your adjuster directly — and if we think your
              carrier is wrong about something, we will tell you why in writing.
            </p>
            <div className="mt-8">
              <QuoteButton variant="outline" label="Talk through your claim" />
            </div>
          </div>

          <div className="rounded-2xl border border-sand-200 bg-white p-7 shadow-card">
            <h3 className="font-display text-xl font-bold text-ink-900">
              What we hand your adjuster
            </h3>
            <div className="mt-5">
              <CheckList
                items={[
                  "Dated photo documentation from before any work started",
                  "Daily moisture readings with an unaffected-area baseline",
                  "Written scope of work, line-itemed",
                  "Equipment logs showing exactly what ran and for how long",
                  "Cause-of-loss findings, which is what determines coverage",
                  "Final dry-standard verification before reconstruction",
                ]}
              />
            </div>
            <p className="mt-6 rounded-lg bg-water-50 p-4 text-sm leading-relaxed text-ink-700">
              <strong className="font-semibold text-ink-900">
                Worth knowing:
              </strong>{" "}
              you choose your restoration contractor, not your insurer. A carrier
              can recommend someone from their preferred vendor program, but in
              Washington the decision is yours.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------------- SERVICE AREA ---------------- */}
      <Section>
        <SectionHeading
          eyebrow="Where we work"
          title={`Serving ${business.address.city} and Snohomish County`}
          lead="We are close enough to get there fast, and local enough to know what typically goes wrong in your specific town."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-sand-200 bg-white px-5 py-4 transition hover:border-water-300 hover:bg-water-50"
            >
              <span>
                <span className="block font-display text-lg font-bold text-ink-900">
                  {area.city}, WA
                </span>
                <span className="block text-sm text-ink-600">
                  Typical arrival {area.eta}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-water-600 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
        <p className="mt-8 text-ink-700">
          Not on the list? Call anyway —{" "}
          <a
            href={telHref}
            className="font-bold text-water-700 underline underline-offset-4"
          >
            {business.phone.display}
          </a>
          . If we cannot get to you in time to help, we will tell you straight
          and point you at someone who can.
        </p>
      </Section>

      {/* ---------------- REVIEWS (renders only with real data) ---------------- */}
      {hasReviews ? (
        <Section tone="sand">
          <SectionHeading
            eyebrow="Reviews"
            title="What our neighbors say"
            lead={
              averageRating
                ? `${averageRating} out of 5 across verified reviews.`
                : undefined
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredReviews.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-card"
              >
                <div className="flex gap-0.5 text-alert-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink-700">
                  {review.text}
                </blockquote>
                <figcaption className="mt-5 border-t border-sand-200 pt-4 text-sm">
                  <span className="font-bold text-ink-900">{review.author}</span>
                  {review.city ? (
                    <span className="text-ink-600"> · {review.city}, WA</span>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 font-bold text-water-700 hover:underline"
            >
              Read all reviews
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Section>
      ) : null}

      {/* ---------------- QUOTE FORM ---------------- */}
      <Section tone="sand" id="quote">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="No cost, no obligation"
              title="Tell us what happened"
              lead="If it is an active emergency, please call instead — a form is slower than a phone, and speed is the whole game right now."
            />
            <div className="mt-8">
              <CallButton />
            </div>
            <div className="mt-10 rounded-xl border border-sand-200 bg-white p-6">
              <h3 className="font-display text-lg font-bold text-ink-900">
                What happens next
              </h3>
              <div className="mt-4">
                <CheckList
                  items={[
                    "We call you back — same day for anything submitted before evening",
                    "We ask enough questions to know whether this needs a crew or advice",
                    "Free on-site assessment with moisture readings, no charge and no pressure",
                    "A written scope and estimate you can hand to your insurer",
                  ]}
                />
              </div>
            </div>
          </div>
          <QuoteForm />
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}

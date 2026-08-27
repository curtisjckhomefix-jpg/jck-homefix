import type { Metadata } from "next";
import { business } from "@/lib/business";
import { areas } from "@/lib/areas";
import {
  PageHero,
  Section,
  SectionHeading,
  CtaBanner,
  Breadcrumbs,
  CallButton,
  QuoteButton,
  CheckList,
} from "@/components/ui";
import { Shield, Clock, MapPin, Check } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Us",
  description: `${business.legalName} is a locally owned water damage restoration company based in ${business.address.city}, WA, serving homes and businesses across Snohomish County.`,
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Clock,
    title: "We pick up the phone",
    body: "Not an answering service. Not a queue. When you call at 3am, someone who can dispatch a crew answers, because that is the whole point of advertising 24/7 service.",
  },
  {
    icon: Shield,
    title: "We tell you when you do not need us",
    body: "Plenty of calls end with us saying it looks like it dried on its own, here is what to watch for. That costs us a job and earns us the next five.",
  },
  {
    icon: MapPin,
    title: "We live here too",
    body: `We are not a franchise dispatching from another county. ${business.address.city} is home, and the people we work for are neighbors we run into at the store.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`Locally owned water damage restoration in ${business.address.city}`}
        lead={`${business.legalName} — the people who show up when your floor is under water, and who are still around next year if something is not right.`}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CallButton />
          <QuoteButton variant="light" />
        </div>
      </PageHero>

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="Why we do this work the way we do"
            />
            {/*
              ⚠️  PLACEHOLDER COPY — replace with the real story.
              Ask the owner: how did the business start, what did they do before,
              why restoration specifically, and what is the one job they still
              talk about. Two honest paragraphs beat a page of adjectives, and
              this is the section visitors actually read before calling.
            */}
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-700">
              <p>
                Water damage is one of the few home emergencies where the person
                calling has no way to judge whether they are being told the
                truth. You cannot see inside a wall. You do not know whether the
                equipment needs to run for three more days or whether it is
                running because it bills by the day.
              </p>
              <p>
                That imbalance is why this industry has the reputation it does,
                and it is the thing we set out to be different about. We show
                you the moisture readings. We explain what the number means and
                what it has to reach. When the meters say it is dry, the
                equipment comes out — not a day later.
              </p>
              <p>
                We are based in {business.address.city} and we work across{" "}
                {areas.length} communities in Snohomish County. We are licensed,
                bonded, and insured in Washington, and we will hand you the
                registration number before you think to ask for it.
              </p>
            </div>

            <div className="mt-10 rounded-xl border border-water-200 bg-water-50 p-6">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Our promise, in plain terms
              </h2>
              <div className="mt-4">
                <CheckList
                  items={[
                    "A real person answers the phone, any hour of any day",
                    "Free on-site assessment with documented moisture readings",
                    "Written scope and estimate before work starts",
                    "Daily readings shared with you, not just filed away",
                    "Equipment comes out when the meters say dry, not on a billing schedule",
                    `${business.warranty} on the work we perform`,
                  ]}
                />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
              <h2 className="font-display text-xl font-bold text-ink-900">
                Credentials
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-ink-900">Legal entity</dt>
                  <dd className="mt-0.5 text-ink-700">{business.legalName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-900">
                    WA L&amp;I contractor registration
                  </dt>
                  <dd className="mt-0.5 font-mono text-ink-700">
                    {business.license.lni}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-900">Status</dt>
                  <dd className="mt-0.5 flex flex-wrap gap-2">
                    {["Licensed", "Bonded", "Insured"].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-water-100 px-2.5 py-1 text-xs font-semibold text-water-800"
                      >
                        <Check className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-900">Service area</dt>
                  <dd className="mt-0.5 text-ink-700">
                    {business.address.city} and Snohomish County, WA
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-900">Emergency hours</dt>
                  <dd className="mt-0.5 text-ink-700">
                    {business.hours.emergency}
                  </dd>
                </div>
              </dl>
              <p className="mt-5 rounded-lg bg-sand-50 p-3.5 text-xs leading-relaxed text-ink-700">
                You can verify any Washington contractor yourself at the L&amp;I
                Contractor Lookup. We would rather you did.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="dark">
        <SectionHeading
          tone="dark"
          eyebrow="How we operate"
          title="Three things we will not compromise on"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-water-600/20 text-water-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-white">
                  {value.title}
                </h3>
                <p className="mt-3 leading-relaxed text-sand-300">{value.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}

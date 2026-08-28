import type { Metadata } from "next";
import { business } from "@/lib/business";
import { areas } from "@/lib/areas";
import {
  PageHero,
  Section,
  SectionHeading,
  Stamp,
  Readout,
  CtaBanner,
  Breadcrumbs,
  CallButton,
  QuoteButton,
  CheckList,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us",
  description: `${business.legalName} is a locally owned water damage restoration company based in ${business.address.city}, WA, serving homes and businesses across Snohomish County.`,
  alternates: { canonical: "/about" },
};

const values = [
  {
    n: "01",
    title: "We pick up the phone",
    body: "Not an answering service. Not a queue. When you call at 3am, someone who can dispatch a crew answers — that is the whole point of advertising 24/7 service.",
  },
  {
    n: "02",
    title: "We tell you when you do not need us",
    body: "Plenty of calls end with us saying it looks like it dried on its own, here is what to watch for. That costs us a job and earns us the next five.",
  },
  {
    n: "03",
    title: "We live here too",
    body: `Not a franchise dispatching from another county. ${business.address.city} is home, and the people we work for are neighbours we run into at the store.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        stamp={`Est. ${business.founded} · ${business.address.city}, WA`}
        title="Locally owned. Locally answered."
        lead={`${business.legalName} — the people who show up when your floor is under water, and who are still around next year if something is not right.`}
      >
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <CallButton />
          <QuoteButton />
        </div>
      </PageHero>

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />

      <Section tone="carbon">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <SectionHeading
              stamp="Our story"
              title={
                <>
                  Why we work
                  <br />
                  this way.
                </>
              }
            />
            {/*
              ⚠️  PLACEHOLDER COPY — replace with the real story.
              Ask the owner: how did the business start, what did they do before,
              why restoration specifically, and the one job they still talk
              about. Two honest paragraphs beat a page of adjectives, and this is
              the section visitors actually read before calling.
            */}
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-carbon-300">
              <p>
                Water damage is one of the few home emergencies where the person
                calling has no way to judge whether they are being told the
                truth. You cannot see inside a wall. You do not know whether the
                equipment needs three more days, or whether it is running because
                it bills by the day.
              </p>
              <p>
                That imbalance is why this industry has the reputation it does,
                and it is the thing we set out to be different about. We show you
                the moisture readings. We explain what the number means and what
                it has to reach. When the meters say dry, the equipment comes out
                — not a day later.
              </p>
              <p>
                {business.owner.firstName} is based in {business.address.city}{" "}
                and works across {areas.length} communities in Snohomish County.
                Registered in Washington, and we will hand you the registration
                number before you think to ask for it.
              </p>
            </div>

            <div className="mt-12 border-l-2 border-hivis-400 pl-7">
              <h2 className="font-display text-2xl uppercase tracking-tight text-paper-50">
                Our promise, in plain terms
              </h2>
              <div className="mt-6">
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

          <aside className="min-w-0 lg:col-span-4 lg:col-start-9">
            <Stamp>Credentials</Stamp>
            <div className="mt-5 border-2 border-carbon-700 p-6">
              <p className="font-display text-lg uppercase tracking-tight text-paper-50">
                {business.legalName}
              </p>
              <div className="mt-5">
                <Readout
                  rows={[
                    {
                      label: "WA L&I reg.",
                      value: business.license.lni || "Pending — see lib/business.ts",
                    },
                    {
                      label: "Status",
                      value: business.license.lni
                        ? "Licensed · Bonded · Insured"
                        : "Unverified",
                    },
                    { label: "Established", value: String(business.founded) },
                    {
                      label: "Service area",
                      value: `${business.address.city} + Snohomish Co.`,
                    },
                    { label: "Emergency hours", value: "24 / 7 / 365" },
                  ]}
                />
              </div>
              <p className="mt-6 border-t border-carbon-700 pt-5 text-xs leading-relaxed text-carbon-400">
                You can verify any Washington contractor yourself through the
                L&amp;I Contractor Lookup. We would rather you did.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeading
          tone="light"
          stamp="How we operate"
          title="Three things we will not compromise on"
        />
        <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {values.map((value) => (
            <li key={value.n} className="border-t-2 border-carbon-950 pt-5">
              <span className="stamp text-carbon-600">{value.n}</span>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-tight text-carbon-950">
                {value.title}
              </h3>
              <p className="mt-3 leading-relaxed text-carbon-700">{value.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBanner />
    </>
  );
}

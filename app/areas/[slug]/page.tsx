import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { areas, areaBySlug } from "@/lib/areas";
import { services } from "@/lib/services";
import { business, telHref } from "@/lib/business";
import { ArrowRight } from "@/components/icons";
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
} from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const area = areaBySlug(slug);
  if (!area) return {};

  return {
    title: `Water Damage Restoration in ${area.city}, WA`,
    description: `24/7 emergency water damage restoration in ${area.city}, WA. Water extraction, structural drying, flood cleanup, and mold prevention. Typical arrival ${area.eta}.`,
    alternates: { canonical: `/areas/${area.slug}` },
    openGraph: {
      title: `Water Damage Restoration in ${area.city}, WA | ${business.name}`,
      description: `Emergency water damage help in ${area.city}. Typical arrival ${area.eta}.`,
      url: `/areas/${area.slug}`,
    },
  };
}

export default async function AreaPage({ params }: Params) {
  const { slug } = await params;
  const area = areaBySlug(slug);
  if (!area) notFound();

  const nearby = areas.filter((a) => a.slug !== area.slug).slice(0, 6);

  return (
    <>
      <PageHero
        stamp={`${area.county} · 24/7`}
        title={`Water damage restoration in ${area.city}`}
        lead={`Emergency extraction, structural drying and flood cleanup for ${area.city} homes and businesses. Typical arrival ${area.eta}.`}
      >
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <CallButton />
          <QuoteButton />
        </div>
        <div className="mt-10 max-w-md">
          <Readout
            rows={[
              { label: "Typical arrival", value: area.eta.replace("under ", "≤ ") },
              { label: "ZIP codes", value: area.zips.join(" · ") },
              { label: "County", value: area.county },
            ]}
          />
        </div>
      </PageHero>

      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/areas", label: "Service Areas" },
          { label: area.city },
        ]}
      />

      <Section tone="carbon">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              stamp={`Serving ${area.city}`}
              title={`Why ${area.city} homes flood`}
            />
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-carbon-300">
              {area.intro.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            <ol className="mt-12">
              {area.risks.map((risk, i) => (
                <li
                  key={risk.title}
                  className="grid gap-3 border-t border-carbon-700 py-7 sm:grid-cols-[auto_1fr] sm:gap-8"
                >
                  <span className="stamp text-carbon-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-tight text-paper-50">
                      {risk.title}
                    </h3>
                    <p className="mt-2.5 leading-relaxed text-carbon-400">
                      {risk.body}
                    </p>
                  </div>
                </li>
              ))}
              <li aria-hidden="true" className="border-t border-carbon-700" />
            </ol>

            <div className="mt-12">
              <Stamp>Neighbourhoods we cover</Stamp>
              <div className="mt-5 flex flex-wrap gap-2">
                {area.neighborhoods.map((n) => (
                  <span
                    key={n}
                    className="border border-carbon-700 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-carbon-300"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <p className="mt-6 leading-relaxed text-carbon-400">
                Do not see your street? We cover the whole {area.city} area. Call{" "}
                <a
                  href={telHref}
                  className="font-mono font-semibold text-hivis-400 underline underline-offset-4"
                >
                  {business.phone.display}
                </a>{" "}
                and we will tell you honestly how fast we can be there.
              </p>
            </div>
          </div>

          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div>
              <Stamp>Services in {area.city}</Stamp>
              <ul className="mt-5">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-center justify-between gap-4 border-b border-carbon-800 py-3.5 transition-colors hover:border-hivis-400"
                    >
                      <span className="text-sm text-carbon-300 transition-colors group-hover:text-hivis-400">
                        {s.name}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-carbon-600 transition-all group-hover:translate-x-1 group-hover:text-hivis-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Stamp>Nearby areas</Stamp>
              <div className="mt-5 flex flex-wrap gap-2">
                {nearby.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/areas/${a.slug}`}
                    className="border border-carbon-700 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-carbon-300 transition-colors hover:border-hivis-400 hover:text-hivis-400"
                  >
                    {a.city}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="light"
              stamp={`${area.city}, WA`}
              title="Request a free assessment"
              lead={`Tell us what happened and we will get back to you. If water is moving right now, call instead — in ${area.city} we are typically ${area.eta} out.`}
            />
            <div className="mt-9">
              <CallButton />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <QuoteForm />
          </div>
        </div>
      </Section>

      <CtaBanner
        title={`Water damage in ${area.city}?`}
        lead={`We answer 24/7 and are typically on site in ${area.eta}. The assessment is free, and we will tell you straight whether you actually need us.`}
      />
    </>
  );
}

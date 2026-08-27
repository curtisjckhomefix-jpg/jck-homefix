import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { areas, areaBySlug } from "@/lib/areas";
import { services } from "@/lib/services";
import { business, telHref } from "@/lib/business";
import { serviceIcons, ArrowRight, MapPin, Clock } from "@/components/icons";
import {
  PageHero,
  Section,
  SectionHeading,
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

  const nearby = areas.filter((a) => a.slug !== area.slug).slice(0, 5);

  return (
    <>
      <PageHero
        eyebrow={`${area.county} · 24/7`}
        title={`Water Damage Restoration in ${area.city}, WA`}
        lead={`Emergency extraction, structural drying, and flood cleanup for ${area.city} homes and businesses. Typical arrival ${area.eta}.`}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CallButton />
          <QuoteButton variant="light" />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-sand-300">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-water-400" />
            Typical arrival {area.eta}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-water-400" />
            {area.zips.join(" · ")}
          </span>
        </div>
      </PageHero>

      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/areas", label: "Service Areas" },
          { label: area.city },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={`Serving ${area.city}`}
              title={`Why ${area.city} homes flood`}
            />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-700">
              {area.intro.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {area.risks.map((risk) => (
                <div
                  key={risk.title}
                  className="rounded-xl border border-sand-200 bg-sand-50 p-5"
                >
                  <h3 className="font-display text-base font-bold text-ink-900">
                    {risk.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {risk.body}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 font-display text-2xl font-bold text-ink-900">
              Neighborhoods we cover in {area.city}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {area.neighborhoods.map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-sand-300 bg-white px-3.5 py-1.5 text-sm text-ink-800"
                >
                  {n}
                </span>
              ))}
            </div>
            <p className="mt-5 leading-relaxed text-ink-700">
              Do not see your street? We cover the whole {area.city} area — give
              us a call at{" "}
              <a
                href={telHref}
                className="font-bold text-water-700 underline underline-offset-4"
              >
                {business.phone.display}
              </a>{" "}
              and we will tell you honestly how fast we can be there.
            </p>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
              <h2 className="font-display text-xl font-bold text-ink-900">
                Services in {area.city}
              </h2>
              <ul className="mt-4 space-y-1">
                {services.map((s) => {
                  const Icon = serviceIcons[s.icon] ?? serviceIcons.droplet;
                  return (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-water-50"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-water-100 text-water-700">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1 text-sm font-semibold text-ink-900">
                          {s.name}
                        </span>
                        <ArrowRight className="h-4 w-4 text-water-600 transition group-hover:translate-x-1" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Nearby areas
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {nearby.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/areas/${a.slug}`}
                    className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-sm font-medium text-ink-800 transition hover:border-water-400 hover:text-water-700"
                  >
                    {a.city}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={`${area.city}, WA`}
              title="Request a free assessment"
              lead={`Tell us what happened and we will get back to you. If water is moving right now, call instead — it is faster, and in ${area.city} we are typically ${area.eta} out.`}
            />
            <div className="mt-8">
              <CallButton />
            </div>
          </div>
          <QuoteForm />
        </div>
      </Section>

      <CtaBanner
        title={`Water damage in ${area.city}? Call now.`}
        lead={`We answer 24/7 and are typically on site in ${area.eta}. The assessment is free, and we will tell you straight whether you actually need us.`}
      />
    </>
  );
}

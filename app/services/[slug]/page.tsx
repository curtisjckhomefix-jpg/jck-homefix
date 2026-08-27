import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, serviceBySlug } from "@/lib/services";
import { areas } from "@/lib/areas";
import { business } from "@/lib/business";
import { serviceIcons, ArrowRight, Alert } from "@/components/icons";
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

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};

  return {
    title: `${service.name} in ${business.address.city}, WA`,
    description: service.blurb,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} | ${business.name}`,
      description: service.blurb,
      url: `/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const Icon = serviceIcons[service.icon] ?? serviceIcons.droplet;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHero
        eyebrow={service.emergency ? "24/7 emergency service" : "Our services"}
        title={`${service.name} in ${business.address.city}, WA`}
        lead={service.blurb}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CallButton />
          <QuoteButton variant="light" />
        </div>
      </PageHero>

      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { label: service.name },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-water-100 text-water-700">
              <Icon className="h-7 w-7" />
            </span>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-700">
              {service.intro.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            <h2 className="mt-12 font-display text-2xl font-bold text-ink-900">
              What the work includes
            </h2>
            <div className="mt-5">
              <CheckList items={service.includes} />
            </div>

            <h2 className="mt-12 font-display text-2xl font-bold text-ink-900">
              Common questions
            </h2>
            <div className="mt-5 divide-y divide-sand-200 border-y border-sand-200">
              {service.faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-ink-900">
                    {faq.q}
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-sand-300 text-ink-600 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-700">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-alert-500/25 bg-alert-600/5 p-6">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-alert-600 text-white">
                <Alert className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-ink-900">
                Signs you need this now
              </h2>
              <ul className="mt-4 space-y-2.5">
                {service.signs.map((sign) => (
                  <li key={sign} className="flex gap-2.5 text-sm leading-relaxed text-ink-800">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-alert-600" />
                    {sign}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <CallButton className="w-full" />
              </div>
            </div>

            <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Where we provide this
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {areas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/areas/${area.slug}`}
                    className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-sm font-medium text-ink-800 transition hover:border-water-400 hover:text-water-700"
                  >
                    {area.city}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading eyebrow="Related" title="Other services you may need" />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {others.map((other) => {
            const OtherIcon = serviceIcons[other.icon] ?? serviceIcons.droplet;
            return (
              <Link
                key={other.slug}
                href={`/services/${other.slug}`}
                className="group rounded-2xl border border-sand-200 bg-white p-6 transition hover:border-water-300 hover:shadow-card"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-water-100 text-water-700">
                  <OtherIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink-900">
                  {other.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  {other.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-water-700">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}

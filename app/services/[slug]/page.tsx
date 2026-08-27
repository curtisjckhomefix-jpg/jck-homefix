import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, serviceBySlug } from "@/lib/services";
import { areas } from "@/lib/areas";
import { business, telHref } from "@/lib/business";
import { ArrowRight, Alert, Phone } from "@/components/icons";
import {
  PageHero,
  Section,
  SectionHeading,
  Stamp,
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
        stamp={service.emergency ? "24/7 emergency service" : "Service"}
        title={service.name}
        lead={service.blurb}
      >
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <CallButton />
          <QuoteButton />
        </div>
      </PageHero>

      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { label: service.name },
        ]}
      />

      <Section tone="carbon">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="space-y-6 text-lg leading-relaxed text-carbon-300">
              {service.intro.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            <h2 className="mt-14 font-display text-3xl uppercase tracking-tight text-paper-50">
              What the work includes
            </h2>
            <div className="mt-7">
              <CheckList items={service.includes} />
            </div>

            <h2 className="mt-14 font-display text-3xl uppercase tracking-tight text-paper-50">
              Common questions
            </h2>
            <div className="mt-7 border-t border-carbon-700">
              {service.faqs.map((faq) => (
                <details key={faq.q} className="group border-b border-carbon-700">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl uppercase tracking-tight text-paper-50 transition-colors hover:text-hivis-400">
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="grid h-8 w-8 shrink-0 place-items-center border border-carbon-600 font-mono text-lg text-carbon-400 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-6 leading-relaxed text-carbon-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
            <div className="border-2 border-hivis-400">
              <div className="flex items-center gap-3 bg-hivis-400 px-5 py-3.5">
                <Alert className="h-4 w-4 shrink-0 text-carbon-950" />
                <h2 className="font-display text-base uppercase tracking-tight text-carbon-950">
                  Signs you need this now
                </h2>
              </div>
              <ul className="divide-y divide-carbon-800">
                {service.signs.map((sign) => (
                  <li
                    key={sign}
                    className="px-5 py-3.5 text-sm leading-relaxed text-carbon-300"
                  >
                    {sign}
                  </li>
                ))}
              </ul>
              <a
                href={telHref}
                className="flex items-center justify-between gap-3 border-t-2 border-carbon-800 px-5 py-4 transition-colors hover:bg-carbon-850"
              >
                <span className="font-display text-lg tracking-tight text-hivis-400">
                  {business.phone.display}
                </span>
                <Phone className="h-5 w-5 shrink-0 text-hivis-400" />
              </a>
            </div>

            <div>
              <Stamp>Where we provide this</Stamp>
              <div className="mt-5 flex flex-wrap gap-2">
                {areas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/areas/${area.slug}`}
                    className="border border-carbon-700 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-carbon-300 transition-colors hover:border-hivis-400 hover:text-hivis-400"
                  >
                    {area.city}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="carbonDeep">
        <SectionHeading stamp="Related" title="Other services you may need" />
        <ul className="mt-12">
          {others.map((other, i) => (
            <li key={other.slug}>
              <Link
                href={`/services/${other.slug}`}
                className="group flex items-baseline gap-6 border-t border-carbon-700 py-7 transition-colors hover:border-hivis-400 sm:gap-10"
              >
                <span className="stamp shrink-0 text-carbon-600 transition-colors group-hover:text-hivis-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-2xl uppercase tracking-tight text-paper-50 transition-colors group-hover:text-hivis-400">
                    {other.name}
                  </span>
                  <span className="mt-2 block max-w-xl leading-relaxed text-carbon-400">
                    {other.blurb}
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 self-center text-carbon-600 transition-all group-hover:translate-x-1.5 group-hover:text-hivis-400" />
              </Link>
            </li>
          ))}
          <li aria-hidden="true" className="border-t border-carbon-700" />
        </ul>
      </Section>

      <CtaBanner />
    </>
  );
}

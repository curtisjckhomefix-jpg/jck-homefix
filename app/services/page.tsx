import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/lib/services";
import { business } from "@/lib/business";
import { ArrowRight } from "@/components/icons";
import {
  PageHero,
  Section,
  CtaBanner,
  Breadcrumbs,
  CallButton,
  QuoteButton,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Water Damage Restoration Services",
  description:
    "Emergency water extraction, structural drying, flood cleanup, mold prevention, crawl space drying, and 24/7 response across Arlington and Snohomish County, WA.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        stamp="Services"
        title="Start to finish, one crew"
        lead={`Every stage of a water loss for ${business.address.city} and Snohomish County — from the emergency call at 2am through to the drywall going back up.`}
      >
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <CallButton />
          <QuoteButton />
        </div>
      </PageHero>

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Services" }]} />

      <Section tone="carbon">
        <ul>
          {services.map((service, i) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="group grid gap-6 border-t border-carbon-700 py-10 transition-colors hover:border-hivis-400 lg:grid-cols-12 lg:gap-10"
              >
                <div className="flex min-w-0 items-baseline gap-6 lg:col-span-5">
                  <span className="stamp shrink-0 text-carbon-600 transition-colors group-hover:text-hivis-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="min-w-0 font-display text-3xl uppercase tracking-tight text-paper-50 transition-colors group-hover:text-hivis-400 sm:text-4xl">
                    {service.name}
                  </h2>
                </div>

                <div className="min-w-0 lg:col-span-6">
                  <p className="leading-relaxed text-carbon-400">
                    {service.blurb}
                  </p>
                  {service.emergency ? (
                    <span className="stamp mt-4 inline-block border border-hivis-400/50 px-2.5 py-1 text-hivis-400">
                      24/7 emergency
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0 flex items-center lg:col-span-1 lg:justify-end">
                  <ArrowRight className="h-6 w-6 text-carbon-600 transition-all group-hover:translate-x-1.5 group-hover:text-hivis-400" />
                </div>
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

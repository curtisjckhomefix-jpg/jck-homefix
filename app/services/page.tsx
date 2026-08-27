import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/lib/services";
import { business } from "@/lib/business";
import { serviceIcons, ArrowRight } from "@/components/icons";
import { PageHero, Section, CtaBanner, Breadcrumbs, CallButton, QuoteButton } from "@/components/ui";

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
        eyebrow="Our services"
        title="Water damage restoration, start to finish"
        lead={`Every stage of a water loss for ${business.address.city} and Snohomish County — from the emergency call at 2am through to the drywall going back up.`}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CallButton />
          <QuoteButton variant="light" />
        </div>
      </PageHero>

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Services" }]} />

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon] ?? serviceIcons.droplet;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col rounded-2xl border border-sand-200 bg-white p-7 shadow-card transition hover:-translate-y-0.5 hover:border-water-300 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-water-100 text-water-700 transition group-hover:bg-water-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  {service.emergency ? (
                    <span className="rounded-full bg-alert-600/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-alert-700">
                      24/7 emergency
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold text-ink-900">
                  {service.name}
                </h2>
                <p className="mt-3 flex-1 leading-relaxed text-ink-700">
                  {service.blurb}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-bold text-water-700">
                  What this involves
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

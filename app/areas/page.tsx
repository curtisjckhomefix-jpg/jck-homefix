import Link from "next/link";
import type { Metadata } from "next";
import { areas } from "@/lib/areas";
import { business } from "@/lib/business";
import { ArrowRight, MapPin } from "@/components/icons";
import { PageHero, Section, CtaBanner, Breadcrumbs, CallButton, QuoteButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Service Areas in Snohomish County, WA",
  description:
    "24/7 water damage restoration across Arlington, Marysville, Smokey Point, Stanwood, Lake Stevens, Granite Falls, Everett, Snohomish, Monroe, and Darrington, WA.",
  alternates: { canonical: "/areas" },
};

export default function AreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Service areas"
        title="Where we work in Snohomish County"
        lead={`Based in ${business.address.city}, covering the north county and down through Everett. Local enough to get there fast, and to know what usually goes wrong in your town specifically.`}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CallButton />
          <QuoteButton variant="light" />
        </div>
      </PageHero>

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Service Areas" }]} />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group flex flex-col rounded-2xl border border-sand-200 bg-white p-7 shadow-card transition hover:-translate-y-0.5 hover:border-water-300 hover:shadow-lift"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-water-100 text-water-700 transition group-hover:bg-water-600 group-hover:text-white">
                  <MapPin className="h-5 w-5" />
                </span>
                {area.primary ? (
                  <span className="rounded-full bg-water-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-water-700">
                    Home base
                  </span>
                ) : null}
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-ink-900">
                {area.city}, WA
              </h2>
              <p className="mt-1 text-sm font-semibold text-water-700">
                Typical arrival {area.eta}
              </p>
              <p className="mt-3 flex-1 leading-relaxed text-ink-700">
                {area.intro[0]}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-bold text-water-700">
                {area.city} water damage help
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}

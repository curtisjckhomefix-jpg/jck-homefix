import Link from "next/link";
import type { Metadata } from "next";
import { areas } from "@/lib/areas";
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
  title: "Service Areas in Snohomish County, WA",
  description:
    "24/7 water damage restoration across Arlington, Marysville, Smokey Point, Stanwood, Lake Stevens, Granite Falls, Everett, Snohomish, Monroe, and Darrington, WA.",
  alternates: { canonical: "/areas" },
};

export default function AreasPage() {
  return (
    <>
      <PageHero
        stamp="Coverage"
        title="Where we work"
        lead={`Based in ${business.address.city}, covering the north county and down through Everett. Close enough to get there fast, local enough to know what usually goes wrong in your town.`}
      >
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <CallButton />
          <QuoteButton />
        </div>
      </PageHero>

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Service Areas" }]} />

      <Section tone="carbon">
        <ul>
          {areas.map((area, i) => (
            <li key={area.slug}>
              <Link
                href={`/areas/${area.slug}`}
                className="group grid gap-5 border-t border-carbon-700 py-9 transition-colors hover:border-hivis-400 lg:grid-cols-12 lg:gap-10"
              >
                <div className="flex items-baseline gap-6 lg:col-span-4">
                  <span className="stamp shrink-0 text-carbon-600 transition-colors group-hover:text-hivis-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-3xl uppercase tracking-tight text-paper-50 transition-colors group-hover:text-hivis-400">
                      {area.city}
                    </span>
                    <span className="stamp mt-2 block text-carbon-500">
                      {area.zips.join(" · ")}
                      {area.primary ? " · Home base" : ""}
                    </span>
                  </span>
                </div>

                <p className="leading-relaxed text-carbon-400 lg:col-span-6">
                  {area.intro[0]}
                </p>

                <div className="flex items-center justify-between gap-4 lg:col-span-2 lg:justify-end">
                  <span className="stamp text-hivis-400">
                    {area.eta.replace("under ", "≤ ")}
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-carbon-600 transition-all group-hover:translate-x-1.5 group-hover:text-hivis-400" />
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

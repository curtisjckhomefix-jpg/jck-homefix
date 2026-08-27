import Image from "next/image";
import type { Metadata } from "next";
import { projects, hasProjects } from "@/lib/projects";
import { business, telHref } from "@/lib/business";
import {
  PageHero,
  Section,
  Breadcrumbs,
  CtaBanner,
  CallButton,
  QuoteButton,
} from "@/components/ui";
import { Phone } from "@/components/icons";

export const metadata: Metadata = {
  title: "Before & After — Water Damage Restoration Projects",
  description: `Real water damage restoration projects completed by ${business.legalName} across Arlington and Snohomish County, WA.`,
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Before and after"
        lead="Real jobs in Snohomish County homes — what the loss looked like when we arrived, and what it looked like when we left."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CallButton />
          <QuoteButton variant="light" />
        </div>
      </PageHero>

      <Breadcrumbs
        items={[{ href: "/", label: "Home" }, { label: "Before & After" }]}
      />

      <Section>
        {hasProjects ? (
          <div className="grid gap-10 lg:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card"
              >
                <div className="grid grid-cols-2">
                  <figure className="relative">
                    <Image
                      src={project.before.src}
                      alt={project.before.alt}
                      width={640}
                      height={480}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <figcaption className="absolute left-3 top-3 rounded-full bg-ink-950/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      Before
                    </figcaption>
                  </figure>
                  <figure className="relative border-l-2 border-white">
                    <Image
                      src={project.after.src}
                      alt={project.after.alt}
                      width={640}
                      height={480}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <figcaption className="absolute left-3 top-3 rounded-full bg-water-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      After
                    </figcaption>
                  </figure>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wide text-water-700">
                    <span>{project.city}, WA</span>
                    <span aria-hidden="true" className="text-sand-300">
                      ·
                    </span>
                    <span>{project.service}</span>
                    {project.days ? (
                      <>
                        <span aria-hidden="true" className="text-sand-300">
                          ·
                        </span>
                        <span>{project.days} days to dry</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="mt-3 font-display text-xl font-bold text-ink-900">
                    {project.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-700">
                    {project.situation}
                  </p>
                  <p className="mt-3 leading-relaxed text-ink-700">
                    {project.work}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Honest empty state. Filler or stock "before/after" photos here
             would be a false claim about work performed. */
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-sand-300 bg-sand-50 p-10 text-center">
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Project photos are on the way
            </h2>
            <p className="mt-4 leading-relaxed text-ink-700">
              We are putting together before-and-after documentation from recent
              jobs across Snohomish County. In the meantime, if you would like
              to see work comparable to your situation, call and ask — we are
              happy to walk you through what a job like yours involves and share
              references.
            </p>
            <a
              href={telHref}
              className="mt-7 inline-flex items-center gap-2.5 rounded-xl bg-alert-600 px-6 py-4 text-base font-bold text-white transition hover:bg-alert-700"
            >
              <Phone className="h-5 w-5" />
              {business.phone.display}
            </a>
          </div>
        )}
      </Section>

      <CtaBanner />
    </>
  );
}

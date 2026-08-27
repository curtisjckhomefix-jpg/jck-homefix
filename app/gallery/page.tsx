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
        stamp="Field record"
        title="Before and after"
        lead="Real jobs in Snohomish County homes — what the loss looked like when we arrived, and what it looked like when we left."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CallButton />
          <QuoteButton />
        </div>
      </PageHero>

      <Breadcrumbs
        items={[{ href: "/", label: "Home" }, { label: "Before & After" }]}
      />

      <Section tone="carbon">
        {hasProjects ? (
          <div className="grid gap-10 lg:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="border-2 border-carbon-700"
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
                    <figcaption className="absolute left-3 top-3 stamp bg-carbon-950 px-3 py-1.5 text-paper-50">
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
                    <figcaption className="absolute left-3 top-3 stamp bg-hivis-400 px-3 py-1.5 text-carbon-950">
                      After
                    </figcaption>
                  </figure>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 stamp text-hivis-400">
                    <span>{project.city}, WA</span>
                    <span aria-hidden="true" className="text-paper-300">
                      ·
                    </span>
                    <span>{project.service}</span>
                    {project.days ? (
                      <>
                        <span aria-hidden="true" className="text-paper-300">
                          ·
                        </span>
                        <span>{project.days} days to dry</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="mt-3 font-display text-2xl uppercase tracking-tight text-paper-50">
                    {project.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-carbon-400">
                    {project.situation}
                  </p>
                  <p className="mt-3 leading-relaxed text-carbon-400">
                    {project.work}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Honest empty state. Filler or stock "before/after" photos here
             would be a false claim about work performed. */
          <div className="mx-auto max-w-2xl border-2 border-dashed border-carbon-700 p-10 text-center">
            <h2 className="font-display text-3xl uppercase tracking-tight text-paper-50">
              Project photos are on the way
            </h2>
            <p className="mt-5 leading-relaxed text-carbon-400">
              We are putting together before-and-after documentation from recent
              jobs across Snohomish County. In the meantime, if you would like
              to see work comparable to your situation, call and ask — we are
              happy to walk you through what a job like yours involves and share
              references.
            </p>
            <a
              href={telHref}
              className="mt-8 inline-flex items-center gap-3 bg-hivis-400 px-7 py-4 font-display text-lg uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300"
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

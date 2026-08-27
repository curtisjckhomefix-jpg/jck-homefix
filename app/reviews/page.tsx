import type { Metadata } from "next";
import { reviews, hasReviews, averageRating } from "@/lib/reviews";
import { business, telHref } from "@/lib/business";
import {
  PageHero,
  Section,
  Breadcrumbs,
  CtaBanner,
  CallButton,
  QuoteButton,
} from "@/components/ui";
import { Star, Phone } from "@/components/icons";

export const metadata: Metadata = {
  title: "Reviews",
  description: `Reviews from ${business.legalName} customers across Arlington and Snohomish County, WA.`,
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        stamp="Reviews"
        title="What our neighbors say"
        lead={
          averageRating
            ? `${averageRating} out of 5 across ${reviews.length} verified reviews.`
            : "Verified reviews from homeowners and businesses across Snohomish County."
        }
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CallButton />
          <QuoteButton />
        </div>
      </PageHero>

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Reviews" }]} />

      <Section tone="carbon">
        {hasReviews ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col border-t-2 border-carbon-700 pt-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-hivis-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <span className="stamp text-carbon-500">
                    {review.source}
                  </span>
                </div>
                <blockquote className="mt-5 flex-1 leading-relaxed text-carbon-300">
                  {review.text}
                </blockquote>
                <figcaption className="stamp mt-6 text-carbon-500">
                  <span className="text-paper-100">{review.author}</span>
                  {review.city ? (
                    <span className="text-carbon-500"> · {review.city}, WA</span>
                  ) : null}
                  {review.service ? (
                    <span className="mt-1 block text-xs text-carbon-600">
                      {review.service}
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          /* Honest empty state — see lib/reviews.ts for why nothing is
             invented here. */
          <div className="mx-auto max-w-2xl border-2 border-dashed border-carbon-700 p-10 text-center">
            <h2 className="font-display text-3xl uppercase tracking-tight text-paper-50">
              Reviews are being collected
            </h2>
            <p className="mt-5 leading-relaxed text-carbon-400">
              We would rather show you nothing than show you something we made
              up. Verified reviews from real customers will appear here as they
              come in.
            </p>
            <p className="mt-5 leading-relaxed text-carbon-400">
              If you have worked with us and would be willing to leave a review,
              it genuinely helps a small local business — and if something went
              wrong, we would much rather hear it directly first.
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

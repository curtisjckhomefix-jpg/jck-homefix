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
        eyebrow="Reviews"
        title="What our neighbors say"
        lead={
          averageRating
            ? `${averageRating} out of 5 across ${reviews.length} verified reviews.`
            : "Verified reviews from homeowners and businesses across Snohomish County."
        }
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CallButton />
          <QuoteButton variant="light" />
        </div>
      </PageHero>

      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Reviews" }]} />

      <Section>
        {hasReviews ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-alert-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-ink-600">
                    {review.source}
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink-700">
                  {review.text}
                </blockquote>
                <figcaption className="mt-5 border-t border-sand-200 pt-4 text-sm">
                  <span className="font-bold text-ink-900">{review.author}</span>
                  {review.city ? (
                    <span className="text-ink-600"> · {review.city}, WA</span>
                  ) : null}
                  {review.service ? (
                    <span className="mt-1 block text-xs text-ink-600">
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
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-sand-300 bg-sand-50 p-10 text-center">
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Reviews are being collected
            </h2>
            <p className="mt-4 leading-relaxed text-ink-700">
              We would rather show you nothing than show you something we made
              up. Verified reviews from real customers will appear here as they
              come in.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              If you have worked with us and would be willing to leave a review,
              it genuinely helps a small local business — and if something went
              wrong, we would much rather hear it directly first.
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

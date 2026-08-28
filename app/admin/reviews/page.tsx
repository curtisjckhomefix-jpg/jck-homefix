import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAllReviews, type Review } from "@/lib/db";
import { saveReview, removeReview } from "../actions";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { Star } from "@/components/icons";

export const metadata: Metadata = {
  title: "Reviews",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

const input =
  "w-full border-2 border-carbon-700 bg-carbon-900 px-4 py-3 text-paper-50 transition-colors focus:border-hivis-400 focus:outline-none";
const label = "stamp block text-carbon-500";

function ReviewForm({ review }: { review?: Review }) {
  const k = review?.id ?? "new";
  return (
    <form action={saveReview} className="border-2 border-carbon-700 p-6">
      {review ? <input type="hidden" name="id" value={review.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`a-${k}`} className={label}>
            Customer name
          </label>
          <input
            id={`a-${k}`}
            name="author"
            required
            defaultValue={review?.author ?? ""}
            className={`${input} mt-2`}
          />
        </div>

        <div>
          <label htmlFor={`r-${k}`} className={label}>
            Rating
          </label>
          <select
            id={`r-${k}`}
            name="rating"
            defaultValue={String(review?.rating ?? 5)}
            className={`${input} mt-2`}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`b-${k}`} className={label}>
            Review
          </label>
          <textarea
            id={`b-${k}`}
            name="body"
            required
            rows={3}
            defaultValue={review?.body ?? ""}
            className={`${input} mt-2 resize-y`}
          />
        </div>

        <div>
          <label htmlFor={`c-${k}`} className={label}>
            City
          </label>
          <input
            id={`c-${k}`}
            name="city"
            list="rv-cities"
            defaultValue={review?.city ?? ""}
            className={`${input} mt-2`}
          />
          <datalist id="rv-cities">
            {areas.map((a) => (
              <option key={a.slug} value={a.city} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor={`s-${k}`} className={label}>
            Service
          </label>
          <select
            id={`s-${k}`}
            name="service"
            defaultValue={review?.service ?? ""}
            className={`${input} mt-2`}
          >
            <option value="">Not specified</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`src-${k}`} className={label}>
            Source
          </label>
          <select
            id={`src-${k}`}
            name="source"
            defaultValue={review?.source ?? "direct"}
            className={`${input} mt-2`}
          >
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
            <option value="direct">Direct</option>
          </select>
        </div>

        <div>
          <label htmlFor={`d-${k}`} className={label}>
            Date
          </label>
          <input
            id={`d-${k}`}
            name="reviewed_on"
            type="date"
            defaultValue={review?.reviewed_on?.slice(0, 10) ?? ""}
            className={`${input} mt-2`}
          />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-center gap-3 border-2 border-carbon-700 px-4 py-3">
        <input
          type="checkbox"
          name="published"
          defaultChecked={review?.published ?? false}
          className="h-4 w-4 accent-hivis-500"
        />
        <span className="text-sm text-paper-100">
          Published — visible on the public site
        </span>
      </label>

      <button
        type="submit"
        className="mt-6 bg-hivis-400 px-7 py-4 font-display text-lg uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300"
      >
        {review ? "Save changes" : "Add review"}
      </button>
    </form>
  );
}

export default async function AdminReviewsPage() {
  let reviews: Review[] = [];
  let error: string | null = null;
  try {
    reviews = await getAllReviews();
  } catch (err) {
    error = err instanceof Error ? err.message : "Database unavailable";
  }

  const published = reviews.filter((r) => r.published).length;

  return (
    <AdminShell
      title="Reviews"
      intro={`Only add reviews real customers actually gave you. ${published} of ${reviews.length} published.`}
    >
      <div className="mb-8 border-l-2 border-hivis-400 pl-5">
        <p className="leading-relaxed text-carbon-300">
          Inventing reviews is not a grey area — the FTC&rsquo;s fake-review
          rule (16 CFR Part 465) carries civil penalties. Paste real ones, or
          quote a real Google review with the customer&rsquo;s name as it
          appears there.
        </p>
      </div>

      {error ? (
        <div className="mb-8 border-2 border-siren-500 p-6">
          <p className="font-mono text-sm text-siren-500">{error}</p>
        </div>
      ) : null}

      <section className="mb-14">
        <h2 className="stamp mb-4 text-hivis-400">Add a review</h2>
        <ReviewForm />
      </section>

      <section>
        <h2 className="stamp mb-4 text-hivis-400">
          Existing ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="border-2 border-dashed border-carbon-700 p-10 text-center">
            <p className="font-display text-2xl uppercase tracking-tight text-paper-50">
              No reviews yet
            </p>
            <p className="mt-3 leading-relaxed text-carbon-400">
              The public reviews page shows an honest empty state until there
              is at least one published review.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {reviews.map((r) => (
              <article key={r.id} className="border-2 border-carbon-800">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-carbon-800 px-5 py-3">
                  <span className="flex items-center gap-3">
                    <span className="flex gap-0.5 text-hivis-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5" />
                      ))}
                    </span>
                    <span className="stamp text-carbon-500">
                      {r.author}
                      {r.city ? ` · ${r.city}` : ""} · {r.source}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className={`stamp px-2 py-1 ${
                        r.published
                          ? "bg-hivis-400 text-carbon-950"
                          : "border border-carbon-700 text-carbon-500"
                      }`}
                    >
                      {r.published ? "Published" : "Draft"}
                    </span>
                    <form action={removeReview}>
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        type="submit"
                        className="stamp border border-carbon-700 px-3 py-1.5 text-carbon-400 transition-colors hover:border-siren-500 hover:text-siren-500"
                      >
                        Delete
                      </button>
                    </form>
                  </span>
                </header>

                <details>
                  <summary className="cursor-pointer px-5 py-4 leading-relaxed text-carbon-300 hover:text-paper-100">
                    {r.body.slice(0, 120)}
                    {r.body.length > 120 ? "…" : ""}
                  </summary>
                  <div className="px-5 pb-5">
                    <ReviewForm review={r} />
                  </div>
                </details>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}

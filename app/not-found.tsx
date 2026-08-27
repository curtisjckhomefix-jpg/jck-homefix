import Link from "next/link";
import { business, telHref } from "@/lib/business";
import { Phone } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="bg-ink-950 py-24 text-white sm:py-32">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-display text-6xl font-black text-water-500">404</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            That page is not here.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-sand-200">
            The link may be old, or we may have moved it. If you are dealing with
            water damage right now, do not hunt around the site — just call.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-alert-600 px-6 py-4 text-base font-bold text-white transition hover:bg-alert-700"
            >
              <Phone className="h-5 w-5" />
              {business.phone.display}
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-6 py-4 text-base font-bold text-white transition hover:bg-white hover:text-ink-900"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

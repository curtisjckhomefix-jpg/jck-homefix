import Link from "next/link";
import { business, telHref } from "@/lib/business";
import { Phone } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="grain blueprint bg-carbon-950 py-24 text-paper-50 sm:py-32">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-display text-7xl text-hivis-400">404</p>
          <h1 className="mt-5 text-5xl uppercase tracking-tight sm:text-6xl">
            That page is not here.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-carbon-300">
            The link may be old, or we may have moved it. If you are dealing with
            water damage right now, do not hunt around the site — just call.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-3 bg-hivis-400 px-7 py-5 font-display text-lg uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300"
            >
              <Phone className="h-5 w-5" />
              {business.phone.display}
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center border-2 border-paper-100/35 px-7 py-5 font-display text-lg uppercase tracking-tight text-paper-50 transition-colors hover:border-hivis-400 hover:text-hivis-400"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

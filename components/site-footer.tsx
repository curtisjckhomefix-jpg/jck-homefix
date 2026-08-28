import Link from "next/link";
import { business, telHref, addressLine } from "@/lib/business";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { Phone } from "@/components/icons";
import { cloudinaryUrl } from "@/lib/cloudinary";
import type { SiteLogo } from "@/components/site-header";

export function SiteFooter({ logo = null }: { logo?: SiteLogo }) {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative bg-carbon-950">
      <div aria-hidden="true" className="hazard-rule" />

      <div className="container-page relative py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            {logo ? (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cloudinaryUrl(logo.publicId, { width: 520 })}
                  alt={logo.alt || business.name}
                  className="h-12 w-auto max-w-[16rem] object-contain"
                />
                <span className="stamp mt-3 block text-carbon-500">
                  Est. {business.founded} · Arlington, WA
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center bg-hivis-400 font-display text-base tracking-tight text-carbon-950">
                  JCK
                </span>
                <span className="leading-none">
                  <span className="block font-display text-lg uppercase tracking-tight text-paper-50">
                    HomeFix America
                  </span>
                  <span className="stamp mt-1.5 block text-carbon-500">
                    Est. {business.founded} · Arlington, WA
                  </span>
                </span>
              </div>
            )}

            <p className="mt-6 max-w-sm leading-relaxed text-carbon-400">
              Emergency water damage restoration for {business.address.city} and
              Snohomish County. Locally owned. We answer our own phone, at any
              hour.
            </p>

            <a
              href={telHref}
              className="mt-7 inline-flex items-center gap-3 border-2 border-hivis-400 px-6 py-4 font-display text-lg uppercase tracking-tight text-hivis-400 transition-colors hover:bg-hivis-400 hover:text-carbon-950"
            >
              <Phone className="h-5 w-5" />
              {business.phone.display}
            </a>
          </div>

          <div>
            <h2 className="stamp text-carbon-500">Services</h2>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-carbon-300 transition-colors hover:text-hivis-400"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="stamp text-carbon-500">Areas served</h2>
            <ul className="mt-5 space-y-3">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/areas/${a.slug}`}
                    className="text-sm text-carbon-300 transition-colors hover:text-hivis-400"
                  >
                    {a.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="stamp text-carbon-500">Company</h2>
            <ul className="mt-5 space-y-3">
              {[
                { href: "/about", label: "About" },
                { href: "/gallery", label: "Before & After" },
                { href: "/reviews", label: "Reviews" },
                { href: "/contact", label: "Request assessment" },
                { href: "/privacy", label: "Privacy" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-carbon-300 transition-colors hover:text-hivis-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Credential plate. RCW 18.27.200 requires the L&I registration
                number in all advertising, a website included.

                When the number is not set we deliberately render a loud
                pre-launch warning rather than quietly omitting it or, worse,
                still claiming "Licensed · Bonded · Insured". An unverifiable
                credential claim is the one thing on this site that must never
                render silently. */}
            {business.license.lni ? (
              <div className="mt-8 border-2 border-carbon-800 p-5">
                <p className="stamp text-carbon-500">Registered contractor</p>
                <p className="mt-3 text-sm font-semibold text-paper-100">
                  {business.legalName}
                </p>
                <dl className="mt-3 space-y-1.5">
                  <div className="flex justify-between gap-4">
                    <dt className="stamp text-carbon-500">WA L&amp;I</dt>
                    <dd className="font-mono text-xs text-hivis-400">
                      {business.license.lni}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="stamp text-carbon-500">Status</dt>
                    <dd className="font-mono text-xs text-carbon-300">
                      Bonded · Insured
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="mt-8 border-2 border-siren-500 p-5">
                <p className="stamp text-siren-500">Not ready to launch</p>
                <p className="mt-3 text-sm leading-relaxed text-carbon-300">
                  No WA L&amp;I contractor registration number is set. Washington
                  requires it in all advertising. Set{" "}
                  <code className="font-mono text-hivis-400">
                    license.lni
                  </code>{" "}
                  in{" "}
                  <code className="font-mono text-hivis-400">
                    lib/business.ts
                  </code>{" "}
                  before this site goes public.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-carbon-800">
        <div className="container-page flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="stamp text-carbon-500">
            © {year} {business.legalName}
          </p>
          <p className="stamp text-carbon-500">{addressLine}</p>
        </div>
      </div>
    </footer>
  );
}

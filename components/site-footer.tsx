import Link from "next/link";
import { business, telHref, addressLine } from "@/lib/business";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { Phone, MapPin, Clock } from "@/components/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-sand-200">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-water-600 text-base font-black tracking-tight text-white">
              JCK
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold text-white">
                HomeFix America
              </span>
              <span className="block text-xs text-water-300">
                Water Damage Restoration
              </span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-sand-300">
            Emergency water damage restoration for{" "}
            {business.address.city}{" "}
            and Snohomish County. Locally owned, and we answer the phone
            ourselves at any hour.
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href={telHref}
                className="flex items-center gap-2.5 font-bold text-white transition hover:text-water-300"
              >
                <Phone className="h-4 w-4 shrink-0 text-alert-500" />
                {business.phone.display}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-water-400" />
              <span>{addressLine}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-water-400" />
              <span>Emergency service {business.hours.emergency}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
            Services
          </h2>
          <ul className="space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sand-300 transition hover:text-water-300"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
            Service Areas
          </h2>
          <ul className="space-y-2.5 text-sm">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="text-sand-300 transition hover:text-water-300"
                >
                  {a.city}, WA
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
            Company
          </h2>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/about" className="text-sand-300 transition hover:text-water-300">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-sand-300 transition hover:text-water-300">
                Before &amp; After
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="text-sand-300 transition hover:text-water-300">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sand-300 transition hover:text-water-300">
                Request an Assessment
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-sand-300 transition hover:text-water-300">
                Privacy Policy
              </Link>
            </li>
          </ul>

          <div className="mt-6 rounded-lg border border-ink-800 bg-ink-900 p-4 text-xs leading-relaxed text-sand-300">
            <p className="font-semibold text-white">{business.legalName}</p>
            {/* RCW 18.27.200 — WA requires the L&I registration number in
                all advertising, this website included. */}
            <p className="mt-1">
              WA L&amp;I Contractor Reg.{" "}
              <span className="font-mono text-water-300">
                {business.license.lni}
              </span>
            </p>
            <p className="mt-1">Licensed · Bonded · Insured</p>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-sand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.legalName}. All rights reserved.
          </p>
          <p>
            Serving {business.address.city} and Snohomish County, Washington.
          </p>
        </div>
      </div>
    </footer>
  );
}

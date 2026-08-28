"use client";

import Link from "next/link";
import { useState } from "react";
import { business, telHref } from "@/lib/business";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { Phone, Menu, Close, ArrowRight } from "@/components/icons";
import { cloudinaryUrl } from "@/lib/cloudinary";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Areas" },
  { href: "/gallery", label: "Work" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
];

export type SiteLogo = { publicId: string; alt: string } | null;

/**
 * Wordmark. Falls back to the CSS monogram lockup when no logo is uploaded —
 * a coloured box with three letters costs no HTTP request, so the fallback is
 * genuinely better than a placeholder image.
 */
function Wordmark({ logo }: { logo: SiteLogo }) {
  if (logo) {
    return (
      <Link href="/" className="flex items-center" aria-label={`${business.name} home`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cloudinaryUrl(logo.publicId, { width: 720 })}
          alt={logo.alt || business.name}
          className="h-12 w-auto max-w-[min(62vw,22rem)] object-contain sm:h-14 lg:h-16"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${business.name} home`}>
      <span className="grid h-11 w-11 shrink-0 place-items-center bg-hivis-400 font-display text-base tracking-tight text-carbon-950 transition-colors group-hover:bg-hivis-300">
        JCK
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg uppercase tracking-tight text-paper-50">
          HomeFix America
        </span>
        <span className="stamp mt-1.5 block text-carbon-400">
          Water Damage Restoration
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader({ logo = null }: { logo?: SiteLogo }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Status strip. Reads like a dispatch board, not a promo banner. */}
      <div className="border-b border-carbon-800 bg-carbon-950">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-2.5">
          <p className="stamp flex items-center gap-2.5 text-carbon-400">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping bg-hivis-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 bg-hivis-400" />
            </span>
            Crews available · Answering now
          </p>
          <a
            href={telHref}
            className="stamp text-hivis-400 transition-colors hover:text-hivis-300"
          >
            24/7 Emergency — {business.phone.display}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b-2 border-carbon-800 bg-carbon-950/95 backdrop-blur">
        <div className="container-page flex items-center justify-between gap-6 py-4">
          <Wordmark logo={logo} />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="stamp text-carbon-300 transition-colors hover:text-hivis-400"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={telHref}
              className="flex items-center gap-2.5 bg-hivis-400 px-6 py-3.5 font-display text-base uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300"
            >
              <Phone className="h-4 w-4" />
              Call now
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center border-2 border-carbon-700 text-paper-100 transition-colors hover:border-hivis-400 hover:text-hivis-400 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="max-h-[calc(100dvh-8rem)] overflow-y-auto border-t-2 border-carbon-800 bg-carbon-950 lg:hidden"
          >
            <div className="container-page space-y-8 py-8">
              <a
                href={telHref}
                className="flex items-center justify-between gap-4 bg-hivis-400 px-6 py-5 text-carbon-950"
              >
                <span>
                  <span className="stamp block">Call 24/7</span>
                  <span className="mt-1 block font-display text-xl tracking-tight">
                    {business.phone.display}
                  </span>
                </span>
                <Phone className="h-6 w-6" />
              </a>

              <nav className="border-t border-carbon-800" aria-label="Mobile">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-carbon-800 py-4 font-display text-2xl uppercase tracking-tight text-paper-50 transition-colors hover:text-hivis-400"
                  >
                    {item.label}
                    <ArrowRight className="h-5 w-5 text-carbon-600" />
                  </Link>
                ))}
              </nav>

              <div>
                <p className="stamp mb-4 text-carbon-500">Services</p>
                <div className="grid gap-2">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm text-carbon-300 transition-colors hover:text-hivis-400"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="stamp mb-4 text-carbon-500">Areas</p>
                <div className="flex flex-wrap gap-2">
                  {areas.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/areas/${a.slug}`}
                      onClick={() => setOpen(false)}
                      className="border border-carbon-700 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-carbon-300 transition-colors hover:border-hivis-400 hover:text-hivis-400"
                    >
                      {a.city}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}

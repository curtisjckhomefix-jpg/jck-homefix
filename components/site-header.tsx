"use client";

import Link from "next/link";
import { useState } from "react";
import { business, telHref } from "@/lib/business";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { Phone, Menu, Close, Clock, ArrowRight } from "@/components/icons";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Service Areas" },
  { href: "/gallery", label: "Before & After" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Emergency bar — the single most important element on the site. */}
      <div className="bg-alert-700 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              Water in your home right now? We answer{" "}
              <strong className="font-bold">24/7</strong>.
            </span>
          </p>
          <a
            href={telHref}
            className="flex items-center gap-2 font-bold underline decoration-2 underline-offset-4 transition hover:text-sand-200"
          >
            <Phone className="h-4 w-4" />
            <span>{business.phone.display}</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-sand-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label={`${business.name} home`}
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink-900 text-base font-black tracking-tight text-water-300">
              JCK
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold text-ink-900">
                HomeFix America
              </span>
              <span className="block text-xs font-medium text-ink-600">
                Water Damage Restoration
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-ink-800 transition hover:bg-sand-100 hover:text-water-700"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink-800"
            >
              Free Assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-lg border border-sand-300 text-ink-800 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="border-t border-sand-200 bg-white lg:hidden"
          >
            <div className="container-page space-y-6 py-6">
              <a
                href={telHref}
                className="flex items-center justify-center gap-2 rounded-xl bg-alert-600 px-4 py-4 text-lg font-bold text-white"
              >
                <Phone className="h-5 w-5" />
                Call {business.phone.display}
              </a>

              <nav className="grid gap-1" aria-label="Mobile">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-semibold text-ink-900 hover:bg-sand-100"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 text-ink-600" />
                  </Link>
                ))}
              </nav>

              <div>
                <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-ink-600">
                  Services
                </p>
                <div className="grid gap-0.5">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-ink-800 hover:bg-sand-100"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-ink-600">
                  Service Areas
                </p>
                <div className="flex flex-wrap gap-1.5 px-3">
                  {areas.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/areas/${a.slug}`}
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-sand-300 px-3 py-1.5 text-xs font-medium text-ink-800 hover:border-water-400 hover:text-water-700"
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

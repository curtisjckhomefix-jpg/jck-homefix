import Link from "next/link";
import type { ReactNode } from "react";
import { business, telHref } from "@/lib/business";
import { Phone, ArrowRight, Check } from "@/components/icons";

/* -----------------------------------------------------------------------------
   Sections. Dark is the default state of this site; paper sections are the
   exception used to break rhythm, not the base.
   -------------------------------------------------------------------------- */
export function Section({
  children,
  className = "",
  tone = "carbon",
  id,
  grid = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: "carbon" | "carbonDeep" | "paper" | "hivis";
  id?: string;
  grid?: boolean;
}) {
  const tones = {
    carbon: "bg-carbon-900 text-paper-100",
    carbonDeep: "bg-carbon-950 text-paper-100",
    paper: "bg-paper-50 text-carbon-950",
    hivis: "bg-hivis-400 text-carbon-950",
  };
  return (
    <section
      id={id}
      className={`grain relative ${tones[tone]} ${grid ? "blueprint" : ""} py-20 sm:py-24 lg:py-32 ${className}`}
    >
      <div className="container-page relative">{children}</div>
    </section>
  );
}

/** The mono field-stamp. Used instead of a soft "eyebrow". */
export function Stamp({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={`stamp flex items-center gap-2.5 ${
        tone === "dark" ? "text-hivis-400" : "text-carbon-600"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-8 ${tone === "dark" ? "bg-hivis-400" : "bg-carbon-600"}`}
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  stamp,
  title,
  lead,
  tone = "dark",
  className = "",
}: {
  stamp?: string;
  title: ReactNode;
  lead?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={`max-w-4xl ${className}`}>
      {stamp ? <Stamp tone={tone}>{stamp}</Stamp> : null}
      <h2
        className={`mt-5 text-[clamp(2.25rem,6vw,4.5rem)] ${
          tone === "dark" ? "text-paper-50" : "text-carbon-950"
        }`}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={`mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl ${
            tone === "dark" ? "text-carbon-300" : "text-carbon-700"
          }`}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/* -----------------------------------------------------------------------------
   Buttons. Square. Black-on-amber is real safety signage and is the highest
   contrast pairing on the site, which is exactly where the phone number belongs.
   -------------------------------------------------------------------------- */
export function CallButton({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={telHref}
      className={`group relative inline-flex items-center justify-center gap-3 bg-hivis-400 px-8 py-5 font-display text-lg uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300 ${className}`}
    >
      <Phone className="h-5 w-5" />
      {label ?? business.phone.display}
      <span
        aria-hidden="true"
        className="absolute inset-0 border-2 border-carbon-950 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </a>
  );
}

export function QuoteButton({
  className = "",
  label = "Request an assessment",
  tone = "dark",
}: {
  className?: string;
  label?: string;
  tone?: "dark" | "light";
}) {
  const tones = {
    dark: "border-paper-100/35 text-paper-50 hover:border-hivis-400 hover:text-hivis-400",
    light: "border-carbon-950/25 text-carbon-950 hover:border-carbon-950 hover:bg-carbon-950 hover:text-paper-50",
  };
  return (
    <Link
      href="/contact"
      className={`inline-flex items-center justify-center gap-3 border-2 px-8 py-5 font-display text-lg uppercase tracking-tight transition-colors ${tones[tone]} ${className}`}
    >
      {label}
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
}

/* -----------------------------------------------------------------------------
   Data readout. The documentation motif — a spec sheet rather than a stat card.
   -------------------------------------------------------------------------- */
export function Readout({
  rows,
  tone = "dark",
}: {
  rows: { label: string; value: string }[];
  tone?: "dark" | "light";
}) {
  return (
    <dl
      className={`divide-y ${
        tone === "dark" ? "divide-carbon-700" : "divide-carbon-300/60"
      }`}
    >
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-6 py-3.5"
        >
          <dt
            className={`stamp ${tone === "dark" ? "text-carbon-400" : "text-carbon-600"}`}
          >
            {row.label}
          </dt>
          <dd
            className={`text-right font-mono text-sm font-semibold ${
              tone === "dark" ? "text-hivis-400" : "text-carbon-950"
            }`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CheckList({
  items,
  tone = "dark",
}: {
  items: readonly string[];
  tone?: "dark" | "light";
}) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span
            className={`mt-1 grid h-5 w-5 shrink-0 place-items-center ${
              tone === "dark"
                ? "bg-hivis-400 text-carbon-950"
                : "bg-carbon-950 text-hivis-400"
            }`}
          >
            <Check className="h-3 w-3" />
          </span>
          <span
            className={`leading-relaxed ${
              tone === "dark" ? "text-carbon-300" : "text-carbon-700"
            }`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* -----------------------------------------------------------------------------
   Closing conversion block. Amber field — the loudest surface on the site,
   used exactly once per page so it never loses its force.
   -------------------------------------------------------------------------- */
export function CtaBanner({
  title = "Water does not wait.",
  lead = "Tell us what happened and we will tell you what it actually takes to fix it. No pressure, no scare tactics, no charge for the assessment.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="grain relative bg-hivis-400 py-20 text-carbon-950 sm:py-24">
      <div className="container-page relative">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Stamp tone="light">Emergency line open</Stamp>
            <h2 className="mt-5 text-[clamp(2.5rem,7vw,5.5rem)] text-carbon-950">
              {title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-carbon-900">
              {lead}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href={telHref}
              className="flex items-center justify-between gap-4 border-2 border-carbon-950 bg-carbon-950 px-7 py-6 text-paper-50 transition-colors hover:bg-carbon-900"
            >
              <span>
                <span className="stamp block text-hivis-400">Call 24/7</span>
                <span className="mt-1.5 block font-display text-2xl tracking-tight">
                  {business.phone.display}
                </span>
              </span>
              <Phone className="h-6 w-6 shrink-0 text-hivis-400" />
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-between gap-4 border-2 border-carbon-950 px-7 py-6 transition-colors hover:bg-carbon-950 hover:text-paper-50"
            >
              <span className="font-display text-xl uppercase tracking-tight">
                Request assessment
              </span>
              <ArrowRight className="h-6 w-6 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------------------------------------------------
   Interior page hero. Deliberately more compressed than the homepage hero so
   the two never read as the same slot.
   -------------------------------------------------------------------------- */
export function PageHero({
  stamp,
  title,
  lead,
  children,
}: {
  stamp?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="grain blueprint relative border-b-2 border-carbon-800 bg-carbon-950 pb-16 pt-16 sm:pb-20 sm:pt-20">
      <div className="container-page relative">
        <div className="max-w-4xl">
          {stamp ? (
            <div className="rise" style={{ "--i": 0 } as React.CSSProperties}>
              <Stamp>{stamp}</Stamp>
            </div>
          ) : null}
          <h1
            className="rise mt-5 text-[clamp(2.5rem,7vw,5rem)] text-paper-50"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {title}
          </h1>
          {lead ? (
            <p
              className="rise mt-6 max-w-2xl text-lg leading-relaxed text-carbon-300 sm:text-xl"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {lead}
            </p>
          ) : null}
          {children ? (
            <div className="rise" style={{ "--i": 3 } as React.CSSProperties}>
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-carbon-800 bg-carbon-900"
    >
      <div className="container-page">
        <ol className="stamp flex flex-wrap items-center gap-x-3 gap-y-1 py-4 text-carbon-400">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-3">
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-hivis-400">
                  {item.label}
                </Link>
              ) : (
                <span className="text-paper-100">{item.label}</span>
              )}
              {i < items.length - 1 ? (
                <span aria-hidden="true" className="text-carbon-600">
                  /
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

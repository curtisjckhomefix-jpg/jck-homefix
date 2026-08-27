import Link from "next/link";
import type { ReactNode } from "react";
import { business, telHref } from "@/lib/business";
import { Phone, ArrowRight, Check } from "@/components/icons";

export function Section({
  children,
  className = "",
  tone = "light",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "sand" | "dark" | "water";
  id?: string;
}) {
  const tones = {
    light: "bg-white text-ink-900",
    sand: "bg-sand-50 text-ink-900",
    dark: "bg-ink-950 text-sand-100",
    water: "bg-water-800 text-white",
  };
  return (
    <section id={id} className={`${tones[tone]} py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={`mb-3 text-xs font-bold uppercase tracking-[0.14em] ${
        tone === "dark" ? "text-water-300" : "text-water-700"
      }`}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2
        className={`text-3xl font-bold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] ${
          tone === "dark" ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            tone === "dark" ? "text-sand-200" : "text-ink-700"
          }`}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

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
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl bg-alert-600 px-6 py-4 text-base font-bold text-white shadow-lift transition hover:bg-alert-700 active:bg-alert-700 ${className}`}
    >
      <Phone className="h-5 w-5" />
      {label ?? `Call ${business.phone.display}`}
    </a>
  );
}

export function QuoteButton({
  className = "",
  label = "Request a Free Assessment",
  variant = "solid",
}: {
  className?: string;
  label?: string;
  variant?: "solid" | "outline" | "light";
}) {
  const variants = {
    solid: "bg-ink-900 text-white hover:bg-ink-800",
    outline:
      "border-2 border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white",
    light:
      "border-2 border-white/30 bg-white/10 text-white hover:bg-white hover:text-ink-900",
  };
  return (
    <Link
      href="/contact"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold transition ${variants[variant]} ${className}`}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function CheckList({
  items,
  tone = "light",
}: {
  items: readonly string[];
  tone?: "light" | "dark";
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
              tone === "dark" ? "bg-water-500/20 text-water-300" : "bg-water-100 text-water-700"
            }`}
          >
            <Check className="h-3 w-3" />
          </span>
          <span
            className={`leading-relaxed ${
              tone === "dark" ? "text-sand-200" : "text-ink-700"
            }`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Closing conversion block reused at the bottom of nearly every page. */
export function CtaBanner({
  title = "Water damage does not wait. Neither do we.",
  lead = "Tell us what happened and we will tell you what it actually takes to fix it — no pressure, no scare tactics, no charge for the assessment.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-16 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-water-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-alert-600/10 blur-3xl"
      />
      <div className="container-page relative">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-sand-200">{lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallButton />
            <QuoteButton variant="light" />
          </div>
          <p className="mt-6 text-sm text-sand-300">
            Emergency service {business.hours.emergency} across{" "}
            {business.address.city} and Snohomish County.
          </p>
        </div>
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-sand-200 bg-ink-950 py-16 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="hero-wash absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-water-600/25 blur-3xl"
      />
      <div className="container-page relative">
        <div className="max-w-3xl">
          {eyebrow ? <Eyebrow tone="dark">{eyebrow}</Eyebrow> : null}
          <h1 className="text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-5 text-lg leading-relaxed text-sand-200 sm:text-xl">
              {lead}
            </p>
          ) : null}
          {children}
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
    <nav aria-label="Breadcrumb" className="border-b border-sand-200 bg-sand-50">
      <div className="container-page">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 py-3 text-sm text-ink-600">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="hover:text-water-700 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-ink-900">{item.label}</span>
              )}
              {i < items.length - 1 ? (
                <span aria-hidden="true" className="text-sand-300">
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

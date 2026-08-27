"use client";

import { useState, useRef, useEffect } from "react";
import { areas } from "@/lib/areas";
import { services } from "@/lib/services";
import { business, telHref } from "@/lib/business";
import { Check, Alert, Phone } from "@/components/icons";

type Status = "idle" | "submitting" | "success" | "error";

const urgencyOptions = [
  {
    value: "emergency",
    label: "Emergency — water is active right now",
    hint: "Please call instead if you can",
  },
  { value: "urgent", label: "Urgent — it happened in the last day or two" },
  { value: "recent", label: "Recent — happened within the last couple weeks" },
  { value: "ongoing", label: "Ongoing — musty smell, damp, or suspected mold" },
  { value: "inspection", label: "Just want an inspection or second opinion" },
];

const inputBase =
  "w-full rounded-lg border border-sand-300 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-600/50 transition focus:border-water-500 focus:outline-none focus:ring-4 focus:ring-water-500/15";

const labelBase = "block text-sm font-semibold text-ink-900";

export function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [urgency, setUrgency] = useState("urgent");
  const mountedAt = useRef<number>(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          // Time-trap: a human cannot meaningfully fill this in under 3s.
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please call us.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-water-200 bg-white p-8 shadow-card">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-water-100 text-water-700">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-bold text-ink-900">
          Got it — we have your request.
        </h3>
        <p className="mt-3 leading-relaxed text-ink-700">
          We will call you back shortly. If the situation changes or water starts
          moving again, do not wait on us to call — pick up the phone.
        </p>
        <a
          href={telHref}
          className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-alert-600 px-6 py-4 text-base font-bold text-white transition hover:bg-alert-700"
        >
          <Phone className="h-5 w-5" />
          {business.phone.display}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card sm:p-8"
      noValidate
    >
      {/* Honeypot — hidden from humans, catches naive bots. Real protection is
          the Turnstile hook documented in app/api/quote/route.ts. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 overflow-hidden">
        <label htmlFor="company_website">Do not fill this in</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelBase}>
            Your name <span className="text-alert-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`${inputBase} mt-2`}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelBase}>
            Phone <span className="text-alert-600">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className={`${inputBase} mt-2`}
            placeholder="(360) 555-0142"
          />
          <p className="mt-1.5 text-xs text-ink-600">
            Fastest way to reach you. We call, we do not text-blast.
          </p>
        </div>

        <div>
          <label htmlFor="email" className={labelBase}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`${inputBase} mt-2`}
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label htmlFor="city" className={labelBase}>
            City <span className="text-alert-600">*</span>
          </label>
          <select id="city" name="city" required className={`${inputBase} mt-2`} defaultValue="">
            <option value="" disabled>
              Select your city
            </option>
            {areas.map((a) => (
              <option key={a.slug} value={a.city}>
                {a.city}
              </option>
            ))}
            <option value="Other">Somewhere else in Snohomish County</option>
          </select>
        </div>

        <div>
          <label htmlFor="service" className={labelBase}>
            What do you need?
          </label>
          <select id="service" name="service" className={`${inputBase} mt-2`} defaultValue="">
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={labelBase}>How urgent is it?</legend>
          <div className="mt-2.5 grid gap-2">
            {urgencyOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition ${
                  urgency === opt.value
                    ? "border-water-500 bg-water-50 ring-2 ring-water-500/20"
                    : "border-sand-300 hover:border-sand-300 hover:bg-sand-50"
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={opt.value}
                  checked={urgency === opt.value}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="mt-1 h-4 w-4 shrink-0 accent-water-600"
                />
                <span>
                  <span className="block text-sm font-medium text-ink-900">
                    {opt.label}
                  </span>
                  {opt.hint ? (
                    <span className="block text-xs text-alert-700">{opt.hint}</span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelBase}>
            What happened?
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`${inputBase} mt-2 resize-y`}
            placeholder="Water heater let go in the garage overnight, water got into the hallway carpet and I think under the wall into the bedroom."
          />
        </div>
      </div>

      {urgency === "emergency" ? (
        <div className="mt-5 flex gap-3 rounded-lg border border-alert-500/30 bg-alert-600/5 p-4">
          <Alert className="h-5 w-5 shrink-0 text-alert-600" />
          <p className="text-sm leading-relaxed text-ink-800">
            <strong className="font-semibold">
              If water is moving right now, call instead.
            </strong>{" "}
            A form waits for someone to read it. The phone rings a person, and
            in an active loss that difference is measured in square feet of
            flooring.{" "}
            <a
              href={telHref}
              className="font-bold text-alert-700 underline underline-offset-2"
            >
              {business.phone.display}
            </a>
          </p>
        </div>
      ) : null}

      {status === "error" && error ? (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-alert-500/30 bg-alert-600/5 p-4 text-sm text-alert-700"
        >
          {error} You can always reach us at{" "}
          <a href={telHref} className="font-bold underline">
            {business.phone.display}
          </a>
          .
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-6 py-4 text-base font-bold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request My Free Assessment"}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-600">
        We use your details to respond to this request and nothing else. No
        lists, no resale, no marketing blasts.
      </p>
    </form>
  );
}

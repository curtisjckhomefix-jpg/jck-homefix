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
  { value: "urgent", label: "Urgent — happened in the last day or two" },
  { value: "recent", label: "Recent — within the last couple of weeks" },
  { value: "ongoing", label: "Ongoing — musty, damp, or suspected mold" },
  { value: "inspection", label: "Inspection or second opinion" },
];

const inputBase =
  "w-full border-2 border-carbon-300 bg-paper-50 px-4 py-3.5 font-sans text-carbon-950 transition-colors placeholder:text-carbon-500 focus:border-carbon-950 focus:outline-none";

const labelBase = "stamp block text-carbon-600";

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
      <div className="border-2 border-carbon-950 bg-carbon-950 p-8 text-paper-50 sm:p-10">
        <span className="grid h-12 w-12 place-items-center bg-hivis-400 text-carbon-950">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 font-display text-3xl uppercase tracking-tight">
          Got it.
        </h3>
        <p className="mt-4 leading-relaxed text-carbon-300">
          We have your request and will call you back shortly. If the situation
          changes or water starts moving again, do not wait on us — pick up the
          phone.
        </p>
        <a
          href={telHref}
          className="mt-8 inline-flex items-center gap-3 bg-hivis-400 px-7 py-4 font-display text-lg uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300"
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
      className="border-2 border-carbon-950 bg-paper-100 p-6 text-carbon-950 sm:p-8"
      noValidate
    >
      {/* Honeypot — hidden from humans, catches naive bots. */}
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelBase}>
            Your name <span className="text-siren-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`${inputBase} mt-2.5`}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelBase}>
            Phone <span className="text-siren-600">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className={`${inputBase} mt-2.5 font-mono`}
            placeholder="(360) 555-0142"
          />
          <p className="mt-2 text-xs text-carbon-600">
            We call. We do not text-blast.
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
            className={`${inputBase} mt-2.5`}
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label htmlFor="city" className={labelBase}>
            City <span className="text-siren-600">*</span>
          </label>
          <select
            id="city"
            name="city"
            required
            className={`${inputBase} mt-2.5`}
            defaultValue=""
          >
            <option value="" disabled>
              Select your city
            </option>
            {areas.map((a) => (
              <option key={a.slug} value={a.city}>
                {a.city}
              </option>
            ))}
            <option value="Other">Elsewhere in Snohomish County</option>
          </select>
        </div>

        <div>
          <label htmlFor="service" className={labelBase}>
            What do you need?
          </label>
          <select
            id="service"
            name="service"
            className={`${inputBase} mt-2.5`}
            defaultValue=""
          >
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
          <div className="mt-3 grid gap-0 border-2 border-carbon-300">
            {urgencyOptions.map((opt, i) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3.5 px-4 py-3.5 transition-colors ${
                  i > 0 ? "border-t-2 border-carbon-300" : ""
                } ${
                  urgency === opt.value
                    ? "bg-carbon-950 text-paper-50"
                    : "hover:bg-paper-200"
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={opt.value}
                  checked={urgency === opt.value}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="mt-1 h-4 w-4 shrink-0 accent-hivis-500"
                />
                <span>
                  <span className="block text-sm font-medium">{opt.label}</span>
                  {opt.hint ? (
                    <span
                      className={`mt-0.5 block text-xs ${
                        urgency === opt.value ? "text-hivis-400" : "text-siren-600"
                      }`}
                    >
                      {opt.hint}
                    </span>
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
            className={`${inputBase} mt-2.5 resize-y`}
            placeholder="Water heater let go in the garage overnight. Got into the hallway carpet and I think under the wall into the bedroom."
          />
        </div>
      </div>

      {urgency === "emergency" ? (
        <div className="mt-6 flex gap-4 border-2 border-siren-600 bg-siren-600/10 p-4">
          <Alert className="h-5 w-5 shrink-0 text-siren-600" />
          <p className="text-sm leading-relaxed text-carbon-900">
            <strong className="font-semibold">
              If water is moving right now, call instead.
            </strong>{" "}
            A form waits for someone to read it. The phone rings a person, and in
            an active loss that difference is measured in square feet of
            flooring.{" "}
            <a
              href={telHref}
              className="font-mono font-semibold text-siren-600 underline underline-offset-2"
            >
              {business.phone.display}
            </a>
          </p>
        </div>
      ) : null}

      {status === "error" && error ? (
        <p
          role="alert"
          className="mt-6 border-2 border-siren-600 bg-siren-600/10 p-4 text-sm text-carbon-900"
        >
          {error} You can always reach us at{" "}
          <a href={telHref} className="font-mono font-semibold underline">
            {business.phone.display}
          </a>
          .
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 flex w-full items-center justify-center gap-3 bg-carbon-950 px-6 py-5 font-display text-lg uppercase tracking-tight text-paper-50 transition-colors hover:bg-carbon-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request my free assessment"}
      </button>

      <p className="mt-5 text-center text-xs leading-relaxed text-carbon-600">
        We use your details to respond to this request and nothing else. No
        lists, no resale, no marketing blasts.
      </p>
    </form>
  );
}

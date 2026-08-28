"use client";

import { useEffect, useRef, useState } from "react";
import { business, telHref } from "@/lib/business";
import { Phone } from "@/components/icons";

/**
 * Cloudflare Turnstile widget.
 *
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is absent, so the form
 * works unchanged before the keys are issued.
 *
 * ⚠️ That variable is read at BUILD time and inlined into the client bundle.
 * If it is marked "sensitive" in Vercel it will be empty here with no build
 * error, and the widget will silently never appear. Add it as a plain
 * (non-sensitive) variable.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_ID = "cf-turnstile-script";

export const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function TurnstileWidget({
  onToken,
}: {
  onToken: (token: string | null) => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Keep the latest callback without re-rendering the widget, which would
  // make Turnstile re-challenge the visitor mid-form.
  const cb = useRef(onToken);
  useEffect(() => {
    cb.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!turnstileSiteKey || !holder.current) return;

    let cancelled = false;

    function render() {
      if (cancelled || !window.turnstile || !holder.current) return;
      if (widgetId.current) return;

      widgetId.current = window.turnstile.render(holder.current, {
        sitekey: turnstileSiteKey,
        theme: "dark",
        action: "quote-request",
        callback: (token: string) => cb.current(token),
        "expired-callback": () => cb.current(null),
        "timeout-callback": () => cb.current(null),
        "error-callback": (code?: string) => {
          // The widget could not run: Cloudflare unreachable, blocked by an
          // extension, or — most often — this hostname is not in the widget's
          // Hostname Management list (error 110200).
          //
          // We must NOT tell the visitor "you can still submit". The server
          // rejects tokenless submissions when Turnstile is enforcing, so that
          // reassurance was a lie and left people stuck on a dead form. Show
          // the phone number instead, which is the honest fallback for an
          // emergency service.
          setErrorCode(code ?? "unknown");
          cb.current(null);
        },
      });
    }

    if (window.turnstile) {
      render();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = render;
      s.onerror = () => setErrorCode("script-load-failed");
      document.head.appendChild(s);
    } else {
      document.getElementById(SCRIPT_ID)?.addEventListener("load", render);
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* widget already gone */
        }
        widgetId.current = null;
      }
    };
  }, []);

  if (!turnstileSiteKey) return null;

  return (
    <div className="mt-6">
      <div ref={holder} />
      {errorCode ? (
        <div className="mt-3 border-2 border-siren-500 p-4">
          <p className="text-sm leading-relaxed text-carbon-900">
            <strong className="font-semibold">
              Security check could not load.
            </strong>{" "}
            This form may not go through. Please call us instead — we answer
            around the clock.
          </p>
          <a
            href={telHref}
            className="mt-3 inline-flex items-center gap-2.5 bg-siren-600 px-5 py-3 font-display text-base uppercase tracking-tight text-white transition-colors hover:bg-siren-500"
          >
            <Phone className="h-4 w-4" />
            {business.phone.display}
          </a>
          <p className="stamp mt-3 text-carbon-600">Reference: {errorCode}</p>
        </div>
      ) : null}
    </div>
  );
}

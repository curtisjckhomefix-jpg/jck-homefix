"use client";

import { useEffect, useRef, useState } from "react";

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
  const [failed, setFailed] = useState(false);

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
        "error-callback": () => {
          // Cloudflare unreachable or blocked by an extension. The server
          // allows the request through in that case, so do not trap the
          // visitor behind a widget that will never resolve.
          setFailed(true);
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
      s.onerror = () => setFailed(true);
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
      {failed ? (
        <p className="stamp mt-2 text-carbon-600">
          Verification unavailable — you can still submit
        </p>
      ) : null}
    </div>
  );
}

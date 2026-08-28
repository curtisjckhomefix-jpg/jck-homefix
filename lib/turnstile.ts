/**
 * Cloudflare Turnstile verification.
 *
 * ── Failure modes, chosen deliberately ────────────────────────────────────
 *
 *  · NOT CONFIGURED (no secret key)  → skip verification entirely.
 *    Lets the form keep working before the keys are issued. Logged once so it
 *    cannot silently stay off forever.
 *
 *  · CONFIGURED, token missing/invalid → REJECT.
 *    This is the whole point. A bot that cannot solve the challenge is turned
 *    away.
 *
 *  · CONFIGURED, but Cloudflare itself unreachable → ALLOW, and log loudly.
 *    Same reasoning as the rate limiter: this is an emergency form. If
 *    Cloudflare has an outage we would rather take spam than refuse a real
 *    person whose floor is under water. Note this is a considered trade-off,
 *    not an oversight — an ordinary signup form should fail closed here.
 */

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Enforcement requires BOTH keys.
 *
 * The secret alone is the dangerous half-configuration: the server demands a
 * token that the browser can never produce, because without the public site
 * key the widget does not render. Every real visitor gets a 403 while bots see
 * exactly the same thing — the form is simply dead, and nothing in the build
 * warns you.
 *
 * This bit us in production on 2026-08-28: the secret was live, the site key
 * was not, and the form rejected everyone until it was caught.
 */
const hasSecret = Boolean(process.env.TURNSTILE_SECRET_KEY);
const hasSiteKey = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export const isTurnstileConfigured = hasSecret && hasSiteKey;

/** True for the specific half-configured state described above. */
export const isTurnstileHalfConfigured = hasSecret !== hasSiteKey;

export type TurnstileResult = {
  ok: boolean;
  reason?: string;
  /** True when we allowed the request without a successful verification. */
  degraded?: boolean;
};

let warnedUnconfigured = false;

export async function verifyTurnstile(
  token: string | undefined,
  ip?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (!warnedUnconfigured) {
      warnedUnconfigured = true;
      console.warn(
        "[turnstile] TURNSTILE_SECRET_KEY is not set — bot verification is " +
          "OFF. The form is protected only by the honeypot and time-trap.",
      );
    }
    return { ok: true, degraded: true, reason: "not-configured" };
  }

  // Secret set, site key missing. Enforcing here would reject every real
  // visitor, so refuse to enforce and shout about it instead.
  if (!hasSiteKey) {
    if (!warnedUnconfigured) {
      warnedUnconfigured = true;
      console.error(
        "[turnstile] HALF-CONFIGURED: TURNSTILE_SECRET_KEY is set but " +
          "NEXT_PUBLIC_TURNSTILE_SITE_KEY is not, so the widget cannot render " +
          "and no visitor can produce a token. Verification is DISABLED to " +
          "avoid rejecting real people. Set the site key as a PLAIN " +
          "(non-sensitive) variable — marking it sensitive stops Next.js " +
          "inlining it into the client bundle, with no build error.",
      );
    }
    return { ok: true, degraded: true, reason: "half-configured" };
  }

  if (!token) {
    return { ok: false, reason: "missing-token" };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) {
      console.error("[turnstile] siteverify returned HTTP", res.status);
      return { ok: true, degraded: true, reason: `http-${res.status}` };
    }

    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (data.success) return { ok: true };

    const codes = data["error-codes"] ?? [];

    // These mean OUR configuration is wrong, not that the visitor is a bot.
    // Refusing a real person because we mis-pasted a key would be the worst
    // outcome, so allow through and shout in the logs.
    const configErrors = [
      "invalid-input-secret",
      "missing-input-secret",
      "bad-request",
    ];
    if (codes.some((c) => configErrors.includes(c))) {
      console.error(
        `[turnstile] MISCONFIGURED (${codes.join(", ")}). Check ` +
          "TURNSTILE_SECRET_KEY matches the site key in " +
          "NEXT_PUBLIC_TURNSTILE_SITE_KEY. Allowing the request through.",
      );
      return { ok: true, degraded: true, reason: codes.join(",") };
    }

    return { ok: false, reason: codes.join(",") || "verification-failed" };
  } catch (err) {
    console.error("[turnstile] Cloudflare unreachable, allowing request:", err);
    return { ok: true, degraded: true, reason: "network-error" };
  }
}

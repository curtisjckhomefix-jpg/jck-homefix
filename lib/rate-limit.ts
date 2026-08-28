import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Distributed rate limiting for the quote form.
 *
 * ── It FAILS OPEN, deliberately ───────────────────────────────────────────
 * If Upstash is unreachable or unconfigured, the request is ALLOWED.
 *
 * This is an emergency water-damage form. Someone standing in a flooded
 * hallway at 2am must not be turned away because a Redis node hiccupped.
 * Letting a handful of spam through is a nuisance; dropping one real
 * emergency lead is a business loss and a person left stuck. Turnstile is the
 * layer that actually stops bots — this one only blunts volume.
 *
 * When Upstash is not configured it falls back to an in-process limiter,
 * which is weak (serverless instances do not share memory) but better than
 * nothing for local development.
 */

const WINDOW = "10 m";
const MAX_REQUESTS = 5;

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

export const rateLimitBackend = hasUpstash ? "upstash" : "in-memory";

const limiter = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, WINDOW),
      prefix: "jck:quote",
      analytics: true,
    })
  : null;

// ---- In-process fallback -------------------------------------------------
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;

function memoryLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export type RateLimitResult = {
  limited: boolean;
  backend: string;
  /** Set when the check itself failed and we allowed the request through. */
  degraded?: boolean;
};

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  if (!limiter) {
    return { limited: memoryLimit(key), backend: "in-memory" };
  }

  try {
    const { success } = await limiter.limit(key);
    return { limited: !success, backend: "upstash" };
  } catch (err) {
    // Fail open — see the note at the top of this file.
    console.error("[rate-limit] Upstash unreachable, allowing request:", err);
    return { limited: false, backend: "upstash", degraded: true };
  }
}

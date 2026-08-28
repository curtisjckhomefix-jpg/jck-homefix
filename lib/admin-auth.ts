import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Access-code auth for /admin.
 *
 * Deliberately tiny — one shared code for one person. No user table, no
 * password reset flow, nothing to maintain.
 *
 * ── It FAILS CLOSED ───────────────────────────────────────────────────────
 * If ADMIN_ACCESS_CODE is unset or too short, every check returns false and
 * the admin area is simply unreachable. A missing env var must never mean
 * "let everyone in", which is the direction this kind of code usually rots.
 */

const COOKIE = "jck_admin";
const SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours
const MIN_CODE_LENGTH = 12;

function secret(): string | null {
  const code = process.env.ADMIN_ACCESS_CODE;
  if (!code || code.length < MIN_CODE_LENGTH) return null;
  return code;
}

export function isAdminConfigured(): boolean {
  return secret() !== null;
}

/** Constant-time string compare that does not leak length via early return. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  // timingSafeEqual throws on length mismatch, so hash both to a fixed width
  // first — that keeps the comparison constant-time regardless of input.
  const ah = createHmac("sha256", "cmp").update(ab).digest();
  const bh = createHmac("sha256", "cmp").update(bb).digest();
  return timingSafeEqual(ah, bh);
}

function sign(expiry: number, key: string): string {
  return createHmac("sha256", key).update(String(expiry)).digest("hex");
}

/** Verify a submitted access code. Returns false when unconfigured. */
export function checkAccessCode(submitted: string): boolean {
  const key = secret();
  if (!key) return false;
  if (!submitted) return false;
  return safeEqual(submitted, key);
}

/** Issue a session cookie. Caller must have already verified the code. */
export async function createSession(): Promise<void> {
  const key = secret();
  if (!key) return;

  const expiry = Date.now() + SESSION_MS;
  const token = `${expiry}.${sign(expiry, key)}`;

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // MUST be "/" not "/admin": the upload-signature endpoint lives at
    // /api/admin/..., which is a different path, so a cookie scoped to
    // /admin is never sent to it and every upload 401s.
    path: "/",
    maxAge: Math.floor(SESSION_MS / 1000),
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete({ name: COOKIE, path: "/" });
}

/** True only for a present, unexpired, correctly-signed session. */
export async function isAuthenticated(): Promise<boolean> {
  const key = secret();
  if (!key) return false;

  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;

  const [expStr, mac] = raw.split(".");
  if (!expStr || !mac) return false;

  const expiry = Number(expStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  return safeEqual(mac, sign(expiry, key));
}

/** Suggest a strong code for the operator to paste into Vercel. */
export function suggestCode(): string {
  return randomBytes(18).toString("base64url");
}

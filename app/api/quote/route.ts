import { NextResponse } from "next/server";
import { business } from "@/lib/business";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QuotePayload = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  service?: string;
  urgency?: string;
  message?: string;
  company_website?: string; // honeypot
  elapsedMs?: number;
};

/**
 * Naive in-process rate limit. Good enough to blunt a script; it does NOT
 * survive across serverless instances. If this form starts drawing real abuse,
 * add Cloudflare Turnstile (see TURNSTILE note below) rather than tightening
 * this, because that is what actually worked on the other sites.
 */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/**
 * Only trust the LEFTMOST x-forwarded-for entry, and only because Vercel
 * overwrites this header at the edge. Reading the last entry, or trusting
 * x-real-ip from an arbitrary client, lets a caller spoof their way past the
 * rate limit.
 */
function clientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return "unknown";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const urgencyLabels: Record<string, string> = {
  emergency: "🚨 EMERGENCY — water active now",
  urgent: "⚠️ Urgent — last day or two",
  recent: "Recent — last couple of weeks",
  ongoing: "Ongoing — damp / musty / suspected mold",
  inspection: "Inspection or second opinion",
};

export async function POST(req: Request) {
  let body: QuotePayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // --- Bot filters ---------------------------------------------------------
  if (body.company_website) {
    // Honeypot tripped. Return 200 so the bot believes it succeeded.
    return NextResponse.json({ ok: true });
  }
  if (typeof body.elapsedMs === "number" && body.elapsedMs < 3000) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please call us directly." },
      { status: 429 },
    );
  }

  // --- Validation ----------------------------------------------------------
  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const city = (body.city ?? "").trim();
  const service = (body.service ?? "").trim();
  const urgency = (body.urgency ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "Please enter a valid phone number." },
      { status: 400 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "That email looks off." }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ error: "Please choose your city." }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ error: "That message is too long." }, { status: 400 });
  }

  const isEmergency = urgency === "emergency";
  const subject = `${isEmergency ? "🚨 EMERGENCY LEAD" : "New quote request"} — ${name}, ${city}`;

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:620px">
      <h2 style="margin:0 0 4px">${isEmergency ? "🚨 EMERGENCY REQUEST" : "New quote request"}</h2>
      <p style="margin:0 0 20px;color:#556">via ${escapeHtml(business.url)}</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:15px">
        <tr style="background:#f4f2ee"><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Phone</strong></td><td><a href="tel:${escapeHtml(phone.replace(/\D/g, ""))}">${escapeHtml(phone)}</a></td></tr>
        <tr style="background:#f4f2ee"><td><strong>Email</strong></td><td>${email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : "—"}</td></tr>
        <tr><td><strong>City</strong></td><td>${escapeHtml(city)}</td></tr>
        <tr style="background:#f4f2ee"><td><strong>Service</strong></td><td>${escapeHtml(service || "Not specified")}</td></tr>
        <tr><td><strong>Urgency</strong></td><td>${escapeHtml(urgencyLabels[urgency] ?? urgency ?? "—")}</td></tr>
        <tr style="background:#f4f2ee"><td valign="top"><strong>Message</strong></td><td>${escapeHtml(message || "—").replace(/\n/g, "<br>")}</td></tr>
      </table>
      <p style="margin-top:20px;color:#556;font-size:13px">Received ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} Pacific</p>
    </div>
  `;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_NOTIFICATION_EMAIL ?? business.email;
  const from = process.env.QUOTE_FROM_EMAIL;

  // No delivery configured. Fail LOUD in production rather than silently
  // swallowing a lead — a dropped emergency lead is worse than a form error
  // that tells the visitor to pick up the phone.
  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[quote] No RESEND_API_KEY/QUOTE_FROM_EMAIL set. Payload:", {
        name,
        phone,
        email,
        city,
        service,
        urgency,
        message,
      });
      return NextResponse.json({ ok: true, delivered: false });
    }
    console.error("[quote] Lead received but no email delivery configured.");
    return NextResponse.json(
      { error: "We could not submit that form." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        reply_to: email || undefined,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[quote] Resend rejected the send:", res.status, detail);
      return NextResponse.json(
        { error: "We could not submit that form." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[quote] Send failed:", err);
    return NextResponse.json(
      { error: "We could not submit that form." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

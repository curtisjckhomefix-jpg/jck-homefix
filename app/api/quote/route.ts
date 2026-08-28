import { NextResponse } from "next/server";
import { business } from "@/lib/business";
import { insertQuoteRequest, markEmailSent, isDbConfigured } from "@/lib/db";

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

  // ---------------------------------------------------------------------
  // TWO independent sinks: the database and the notification email.
  //
  // The lead survives if EITHER succeeds. We only report failure to the
  // visitor when BOTH are gone — that is the only case where their request
  // has genuinely vanished and they need to pick up the phone instead.
  // ---------------------------------------------------------------------
  let rowId: number | null = null;
  let stored = false;
  let emailed = false;

  if (isDbConfigured) {
    try {
      rowId = await insertQuoteRequest({
        name,
        phone,
        email: email || null,
        city,
        service: service || null,
        urgency: urgency || null,
        message: message || null,
      });
      stored = true;
    } catch (err) {
      console.error("[quote] DB insert failed:", err);
    }
  }

  if (apiKey && from) {
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

      if (res.ok) {
        emailed = true;
      } else {
        console.error(
          "[quote] Resend rejected the send:",
          res.status,
          await res.text(),
        );
      }
    } catch (err) {
      console.error("[quote] Send failed:", err);
    }
  }

  // Record whether the notification actually went out, so a lead that is in
  // the database but never emailed is findable later:
  //   SELECT * FROM quote_requests WHERE email_sent = false;
  if (stored && emailed && rowId !== null) {
    try {
      await markEmailSent(rowId);
    } catch (err) {
      console.error("[quote] Could not flag email_sent:", err);
    }
  }

  if (!stored && !emailed) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[quote] Nothing configured. Payload:", {
        name,
        phone,
        email,
        city,
        service,
        urgency,
        message,
      });
      return NextResponse.json({ ok: true, stored: false, emailed: false });
    }
    console.error("[quote] LEAD LOST — neither database nor email accepted it.");
    return NextResponse.json(
      { error: "We could not submit that form." },
      { status: 503 },
    );
  }

  if (!emailed) {
    console.warn(`[quote] Row ${rowId} stored but NOT emailed — check Resend.`);
  }

  return NextResponse.json({ ok: true });
}

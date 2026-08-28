import { neon } from "@neondatabase/serverless";

/**
 * Neon over HTTP. Deliberately not Prisma:
 *
 *  · Vercel's build runs a plain `next build` and does NOT run migrations, so
 *    an ORM's migration story buys nothing here and invites the classic
 *    "migrate dev against prod" accident.
 *  · The whole data model is one table. Schema changes are applied directly
 *    against Neon (ADD COLUMN IF NOT EXISTS), never generated and replayed.
 *  · The HTTP driver holds no connections, so it suits serverless functions
 *    and lets the compute scale to zero between form submissions.
 *
 * Schema lives in `db/schema.sql` for reference — that file documents what is
 * already applied, it is not run automatically by anything.
 */

export type QuoteRecord = {
  name: string;
  phone: string;
  email: string | null;
  city: string;
  service: string | null;
  urgency: string | null;
  message: string | null;
};

export const isDbConfigured = Boolean(process.env.DATABASE_URL);

function client() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

/** Insert a quote request. Returns the new row id. */
export async function insertQuoteRequest(q: QuoteRecord): Promise<number> {
  const sql = client();
  const rows = await sql`
    INSERT INTO quote_requests (name, phone, email, city, service, urgency, message)
    VALUES (${q.name}, ${q.phone}, ${q.email}, ${q.city}, ${q.service}, ${q.urgency}, ${q.message})
    RETURNING id
  `;
  return Number((rows[0] as { id: string | number }).id);
}

/** Flag that the Resend notification for a row actually went out. */
export async function markEmailSent(id: number): Promise<void> {
  const sql = client();
  await sql`UPDATE quote_requests SET email_sent = true WHERE id = ${id}`;
}

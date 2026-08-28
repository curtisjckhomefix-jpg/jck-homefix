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

/* ---------------------------------------------------------------------------
   Admin queries. Read/annotate only — nothing here deletes a lead.
   ------------------------------------------------------------------------ */

export type LeadStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "won"
  | "lost"
  | "spam";

export type Lead = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  service: string | null;
  urgency: string | null;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
  contacted_at: string | null;
  email_sent: boolean;
};

/** Newest first. `spam` is excluded unless explicitly asked for. */
export async function listLeads(includeSpam = false): Promise<Lead[]> {
  const sql = client();
  const rows = includeSpam
    ? await sql`SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 500`
    : await sql`SELECT * FROM quote_requests WHERE status <> 'spam' ORDER BY created_at DESC LIMIT 500`;
  return rows as unknown as Lead[];
}

export async function leadCounts(): Promise<Record<string, number>> {
  const sql = client();
  const rows = (await sql`
    SELECT status, count(*)::int AS n FROM quote_requests GROUP BY status
  `) as unknown as { status: string; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.status, r.n]));
}

/**
 * Update a lead's status. Whitelisted against the same set the CHECK
 * constraint enforces, so a crafted form post cannot write arbitrary values.
 */
export async function setLeadStatus(
  id: number,
  status: LeadStatus,
): Promise<void> {
  const allowed: LeadStatus[] = [
    "new",
    "contacted",
    "quoted",
    "won",
    "lost",
    "spam",
  ];
  if (!allowed.includes(status)) throw new Error(`Bad status: ${status}`);

  const sql = client();
  await sql`
    UPDATE quote_requests
       SET status = ${status},
           contacted_at = CASE
             WHEN ${status} = 'contacted' AND contacted_at IS NULL THEN now()
             ELSE contacted_at
           END
     WHERE id = ${id}
  `;
}

/* ---------------------------------------------------------------------------
   CONTENT: projects, reviews, settings — all managed through /admin.
   ------------------------------------------------------------------------ */

export type Project = {
  id: number;
  slug: string;
  title: string;
  city: string;
  service: string | null;
  situation: string | null;
  work: string | null;
  days: number | null;
  before_public_id: string;
  before_alt: string;
  after_public_id: string;
  after_alt: string;
  published: boolean;
  sort_order: number;
};

export type Review = {
  id: number;
  author: string;
  rating: number;
  body: string;
  city: string | null;
  service: string | null;
  source: "google" | "direct" | "facebook";
  reviewed_on: string | null;
  published: boolean;
  sort_order: number;
};

/** Public reads return ONLY published rows — nothing reaches the site by accident. */
export async function getPublishedProjects(): Promise<Project[]> {
  if (!isDbConfigured) return [];
  try {
    const sql = client();
    return (await sql`
      SELECT * FROM projects WHERE published
      ORDER BY sort_order, created_at DESC
    `) as unknown as Project[];
  } catch (err) {
    // A CMS outage must never take the public page down with it.
    console.error("[db] getPublishedProjects failed:", err);
    return [];
  }
}

export async function getPublishedReviews(): Promise<Review[]> {
  if (!isDbConfigured) return [];
  try {
    const sql = client();
    return (await sql`
      SELECT * FROM reviews WHERE published
      ORDER BY sort_order, created_at DESC
    `) as unknown as Review[];
  } catch (err) {
    console.error("[db] getPublishedReviews failed:", err);
    return [];
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const sql = client();
  return (await sql`
    SELECT * FROM projects ORDER BY sort_order, created_at DESC
  `) as unknown as Project[];
}

export async function getAllReviews(): Promise<Review[]> {
  const sql = client();
  return (await sql`
    SELECT * FROM reviews ORDER BY sort_order, created_at DESC
  `) as unknown as Review[];
}

export async function upsertProject(p: Omit<Project, "id"> & { id?: number }) {
  const sql = client();
  if (p.id) {
    await sql`
      UPDATE projects SET
        slug=${p.slug}, title=${p.title}, city=${p.city}, service=${p.service},
        situation=${p.situation}, work=${p.work}, days=${p.days},
        before_public_id=${p.before_public_id}, before_alt=${p.before_alt},
        after_public_id=${p.after_public_id}, after_alt=${p.after_alt},
        published=${p.published}, sort_order=${p.sort_order}, updated_at=now()
      WHERE id=${p.id}`;
    return p.id;
  }
  const rows = await sql`
    INSERT INTO projects (slug,title,city,service,situation,work,days,
      before_public_id,before_alt,after_public_id,after_alt,published,sort_order)
    VALUES (${p.slug},${p.title},${p.city},${p.service},${p.situation},${p.work},
      ${p.days},${p.before_public_id},${p.before_alt},${p.after_public_id},
      ${p.after_alt},${p.published},${p.sort_order})
    RETURNING id`;
  return Number((rows[0] as { id: string | number }).id);
}

export async function upsertReview(r: Omit<Review, "id"> & { id?: number }) {
  const sql = client();
  if (r.id) {
    await sql`
      UPDATE reviews SET
        author=${r.author}, rating=${r.rating}, body=${r.body}, city=${r.city},
        service=${r.service}, source=${r.source}, reviewed_on=${r.reviewed_on},
        published=${r.published}, sort_order=${r.sort_order}
      WHERE id=${r.id}`;
    return r.id;
  }
  const rows = await sql`
    INSERT INTO reviews (author,rating,body,city,service,source,reviewed_on,published,sort_order)
    VALUES (${r.author},${r.rating},${r.body},${r.city},${r.service},${r.source},
      ${r.reviewed_on},${r.published},${r.sort_order})
    RETURNING id`;
  return Number((rows[0] as { id: string | number }).id);
}

/** Returns the Cloudinary IDs that are now orphaned, so the caller can clean up. */
export async function deleteProject(id: number): Promise<string[]> {
  const sql = client();
  const rows = await sql`
    DELETE FROM projects WHERE id=${id}
    RETURNING before_public_id, after_public_id`;
  const r = rows[0] as { before_public_id: string; after_public_id: string } | undefined;
  return r ? [r.before_public_id, r.after_public_id].filter(Boolean) : [];
}

export async function deleteReview(id: number): Promise<void> {
  const sql = client();
  await sql`DELETE FROM reviews WHERE id=${id}`;
}

/* ---- Site settings (logo etc.) ------------------------------------------ */

export async function getSetting(key: string): Promise<string | null> {
  if (!isDbConfigured) return null;
  try {
    const sql = client();
    const rows = await sql`SELECT value FROM site_settings WHERE key=${key}`;
    return (rows[0] as { value: string | null } | undefined)?.value ?? null;
  } catch (err) {
    console.error("[db] getSetting failed:", err);
    return null;
  }
}

export async function setSetting(key: string, value: string | null) {
  const sql = client();
  await sql`
    INSERT INTO site_settings (key, value) VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()`;
}

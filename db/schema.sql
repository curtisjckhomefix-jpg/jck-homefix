-- JCK HomeFix — Neon schema (project green-shape-89436142, db "neondb")
--
-- ALREADY APPLIED. Nothing runs this file automatically: Vercel's build is a
-- plain `next build`. This is the reference copy of what exists in Neon.
--
-- To change the schema, run the DDL directly against Neon and update this
-- file to match. Always ADD COLUMN IF NOT EXISTS — never generate-and-replay
-- migrations against the live database.

CREATE TABLE IF NOT EXISTS quote_requests (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at    timestamptz NOT NULL DEFAULT now(),

  -- Exactly what the form collects, and nothing more. /privacy states we store
  -- only what the visitor types; do not add IP, user-agent or referer columns
  -- without updating that page in the same change.
  name          text        NOT NULL,
  phone         text        NOT NULL,
  email         text,
  city          text        NOT NULL,
  service       text,
  urgency       text,
  message       text,

  -- Operational follow-up, for Curtis.
  status        text        NOT NULL DEFAULT 'new',
  notes         text,
  contacted_at  timestamptz,

  -- Did the Resend notification actually go out for this row?
  email_sent    boolean     NOT NULL DEFAULT false,

  CONSTRAINT quote_requests_status_check
    CHECK (status IN ('new','contacted','quoted','won','lost','spam'))
);

CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx
  ON quote_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS quote_requests_new_idx
  ON quote_requests (created_at DESC) WHERE status = 'new';

-- Useful queries -----------------------------------------------------------
-- New leads, newest first:
--   SELECT id, created_at, name, phone, city, urgency FROM quote_requests
--   WHERE status = 'new' ORDER BY created_at DESC;
--
-- Leads stored but never emailed (Resend was down or misconfigured):
--   SELECT * FROM quote_requests WHERE email_sent = false ORDER BY created_at DESC;
--
-- Mark one as followed up:
--   UPDATE quote_requests SET status='contacted', contacted_at=now() WHERE id=$1;

-- ===========================================================================
-- MEDIA & CONTENT (added 2026-08-28)
-- Managed through /admin rather than by editing code.
-- ===========================================================================

-- Site-wide settings. Key/value so a new setting never needs a migration.
-- Known keys: logo_public_id, logo_alt
CREATE TABLE IF NOT EXISTS site_settings (
  key         text PRIMARY KEY,
  value       text,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Before/after projects shown on /gallery.
CREATE TABLE IF NOT EXISTS projects (
  id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug              text UNIQUE NOT NULL,
  title             text NOT NULL,
  city              text NOT NULL,
  service           text,
  situation         text,
  work              text,
  days              integer,
  before_public_id  text NOT NULL,
  before_alt        text NOT NULL DEFAULT '',
  after_public_id   text NOT NULL,
  after_alt         text NOT NULL DEFAULT '',
  published         boolean NOT NULL DEFAULT false,
  sort_order        integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Customer reviews. published defaults FALSE so nothing reaches the public
-- site until deliberately published — same principle that kept the original
-- reviews array empty rather than filled with invented testimonials.
CREATE TABLE IF NOT EXISTS reviews (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author      text NOT NULL,
  rating      smallint NOT NULL,
  body        text NOT NULL,
  city        text,
  service     text,
  source      text NOT NULL DEFAULT 'direct',
  reviewed_on date,
  published   boolean NOT NULL DEFAULT false,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_source_check CHECK (source IN ('google','direct','facebook'))
);

CREATE INDEX IF NOT EXISTS projects_published_idx ON projects (sort_order, created_at DESC) WHERE published;
CREATE INDEX IF NOT EXISTS reviews_published_idx ON reviews (sort_order, created_at DESC) WHERE published;

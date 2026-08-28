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

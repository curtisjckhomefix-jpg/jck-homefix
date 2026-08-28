#!/usr/bin/env node
/**
 * Apply db/schema.sql to a Neon database.
 *
 *   node scripts/setup-db.mjs "postgresql://user:pass@host/neondb?sslmode=require"
 *   node scripts/setup-db.mjs            # uses DATABASE_URL from .env.local
 *
 * Safe to re-run: every statement is CREATE ... IF NOT EXISTS, so this never
 * drops or overwrites anything. It is the whole "migration" story for this
 * project — one table, applied deliberately, never generated and replayed.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

function resolveUrl() {
  const fromArg = process.argv[2];
  if (fromArg) return fromArg;

  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const envFile = join(root, ".env.local");
  if (existsSync(envFile)) {
    const line = readFileSync(envFile, "utf8")
      .split(/\r?\n/)
      .find((l) => l.startsWith("DATABASE_URL="));
    if (line) return line.slice("DATABASE_URL=".length).trim();
  }
  return null;
}

/** Strip `--` comments, then split on `;`. The comment block at the end of
 *  schema.sql contains semicolons, which a naive split would choke on. */
function statements(sqlText) {
  return sqlText
    .split(/\r?\n/)
    .filter((line) => !line.trimStart().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

const url = resolveUrl();
if (!url) {
  console.error(
    "No connection string.\n" +
      "  Pass one:  node scripts/setup-db.mjs \"postgresql://...\"\n" +
      "  Or set DATABASE_URL in .env.local",
  );
  process.exit(1);
}

const host = url.replace(/\/\/[^@]*@/, "//***@");
console.log(`Applying schema to: ${host}\n`);

const sql = neon(url);
const stmts = statements(readFileSync(join(root, "db", "schema.sql"), "utf8"));

for (const [i, stmt] of stmts.entries()) {
  const label = stmt.split(/\s+/).slice(0, 4).join(" ");
  try {
    await sql.query(stmt);
    console.log(`  ${i + 1}/${stmts.length}  ok    ${label}…`);
  } catch (err) {
    console.error(`  ${i + 1}/${stmts.length}  FAIL  ${label}…`);
    console.error(`         ${err.message}`);
    process.exit(1);
  }
}

const [{ count }] = await sql`SELECT count(*)::int AS count FROM quote_requests`;
console.log(`\nDone. quote_requests exists and holds ${count} row(s).`);

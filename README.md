# JCK HomeFix America — website

Next.js 16 marketing site for **J.C.K. HomeFix LLC**, a 24/7 water damage
restoration company in Arlington, WA serving Snohomish County.

Replaces the unfinished WordPress.com staging site at
`jckhomefixamerica.wpcomstaging.com`, which was a half-edited theme demo
(placeholder phone numbers, `Site Title`, leftover carpentry copy, and invented
review counts).

---

## ⚠️ Before this goes live

The site is complete and builds clean, but **several business facts are
placeholders**. Every one of them lives in `lib/business.ts` — change them there
and they update across the header, footer, schema.org markup, city pages, and
quote-form emails. Do not hardcode them anywhere else.

| Field | Current value | Needed |
|---|---|---|
| `phone.raw` / `phone.display` | `(360) 555-0142` | **Real business number** |
| `email` | `info@jckhomefixamerica.com` | Real inbox |
| `license.lni` | `JCKHOL***` | **WA L&I contractor registration number** |
| `license.ubi` | empty | WA UBI number |
| `address.street` / `.zip` | empty / `98223` | Real address, or leave street blank |
| `founded` | `2019` | Real year |
| `responseTime` | `60–90 minutes` | Verify this is honestly achievable |
| `social.*` | empty | Facebook / Google Business Profile URLs |

### The license number is a legal requirement, not a nicety

**RCW 18.27.200** requires a registered Washington contractor to display its L&I
registration number in *all* advertising, and a website counts. It renders in
the footer and on `/about`. Shipping with `JCKHOL***` in place is a compliance
problem.

Verify the real number at <https://secure.lni.wa.gov/verify/>.

### Empty by design

`lib/reviews.ts` and `lib/projects.ts` are **intentionally empty arrays**, and
the site renders honest empty states instead of filler.

- **Reviews** — inventing testimonials violates the FTC's fake-reviews rule
  (16 CFR Part 465). Add real ones, or wire the Google Business Profile import
  via Places API (New) v1 the way the MRA site does.
- **Before/after photos** — these are advertising claims about work this company
  performed. Stock photos here would be deceptive. Add real job photos to
  `/public/projects/`, with homeowner permission, and nothing identifying.

The `/about` "Our story" section is also placeholder copy, marked with a comment
in `app/about/page.tsx`. Two honest paragraphs from the owner will outperform it.

---

## Stack

- **Next.js 16.3** (App Router, Turbopack) + **React 19**
- **Tailwind CSS 4** — design tokens in `app/globals.css` under `@theme`
- **Resend** for quote-form delivery
- Zero runtime JS dependencies beyond React — icons are inline SVG

## Local development

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
```

## Environment variables

Copy `.env.example` to `.env.local`. Without `RESEND_API_KEY` and
`QUOTE_FROM_EMAIL`, the quote form logs to the console in development and
returns a **503** in production — deliberately loud, because a silently dropped
emergency lead is worse than a visible form error telling the visitor to call.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `QUOTE_FROM_EMAIL` | Verified sender, e.g. `quotes@jckhomefixamerica.com` |
| `QUOTE_NOTIFICATION_EMAIL` | Where leads are delivered (defaults to `business.email`) |

**Vercel gotcha:** `vercel env add` on Production defaults to `--sensitive`,
which silently breaks any `NEXT_PUBLIC_*` variable. Pass `--no-sensitive` for
public vars. Also pipe values with Bash `printf '%s'` — PowerShell piping
prepends a UTF-8 BOM that corrupts keys.

## Content model

Everything is typed data, not hardcoded JSX:

| File | Drives |
|---|---|
| `lib/business.ts` | NAP, license, hours — single source of truth |
| `lib/services.ts` | 7 service pages at `/services/[slug]` |
| `lib/areas.ts` | 10 city pages at `/areas/[slug]` |
| `lib/reviews.ts` | Reviews (empty) |
| `lib/projects.ts` | Before/after gallery (empty) |

Adding a city is one entry in `lib/areas.ts` — the page, nav, footer, sitemap,
and schema `areaServed` all pick it up automatically.

Each city page carries genuinely local content (Stillaguamish flooding for
Arlington and Stanwood, crawl-space saturation, foothill freezes for Granite
Falls) rather than find-and-replace clones, which is what keeps them from
reading as doorway pages to Google.

## Verified quality

Measured, not assumed — all against `pnpm build && pnpm start`:

- **Lighthouse 100/100/100/100** (Perf / A11y / Best Practices / SEO) on home,
  service, city, and contact pages. LCP 0.6s, CLS 0.
- **axe-core: 0 WCAG 2.1 AA violations** across all 10 page types.
- Quote API verified: honeypot and time-trap drop bots with a fake 200,
  validation returns 400s, missing email config returns 503.
- Form flow verified end to end in a real browser, including the conditional
  emergency warning.

## Deploying

Not yet deployed. `jckhomefixamerica.com` currently 301-redirects to the
WordPress.com staging host, so going live means repointing DNS at Vercel.

```bash
vercel --scope <team> link
vercel --scope <team> --prod
```

Keep the WordPress site up until the new one is live and the domain is moved.

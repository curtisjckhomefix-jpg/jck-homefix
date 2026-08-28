# Account ownership — everything under JCK

Decision (2026-08-27): **every service for this site lives on a JCK-owned
account**, not on a personal one. The site is Curtis's business, so the
credentials, the billing and the customer data should all travel with it.

Recommended login for all of them: **`curtis.jckhomefix@gmail.com`**

---

## Status

| Service | Account today | Correct? | Action |
|---|---|---|---|
| **GitHub** | `curtisjckhomefix-jpg` | ✅ | none |
| **Neon** | `dustin.t.arnold215059@gmail.com` | ❌ personal | recreate under JCK |
| **Vercel** | unknown | ? | verify, move if personal |
| **Resend** | unknown | ? | verify, move if personal |
| **Cloudinary** | unknown | ? | verify, move if personal |

**Now is the cheap moment.** The database holds 5 rows, all of them test data.
Cloudinary has no assets. Nothing of value is lost by starting these over —
which will not be true in a month.

---

## 1. Neon

1. Sign out of Neon. Sign up fresh with `curtis.jckhomefix@gmail.com`.
2. Create a project named **`jck-homefix`**, region **`aws-us-east-1`**
   (matches Vercel's default function region, so the form's database round
   trip stays in one datacentre). Keep the default database name `neondb`.
3. Copy the **pooled** connection string — the one containing `-pooler`.
4. Apply the schema:

   ```bash
   node scripts/setup-db.mjs "postgresql://...paste it here..."
   ```

   Safe to re-run; every statement is `CREATE ... IF NOT EXISTS`.
5. Put that connection string in Vercel as `DATABASE_URL`, and in `.env.local`
   for local work. Redeploy.
6. Confirm on `/admin` that **System status → Database (Neon)** is green, then
   delete the old project from the personal account.

No data migration is needed — the 5 existing rows are all tests.

## 2. Vercel

The repo is already owned by `curtisjckhomefix-jpg`, so a JCK Vercel account
can just import it fresh — no project transfer required.

1. Sign up at vercel.com with the JCK account, connecting the
   `curtisjckhomefix-jpg` GitHub account.
2. Import `curtisjckhomefix-jpg/jck-homefix`.
3. Set the environment variables below.
4. Check the new deployment works, then delete the old project.

### Environment variables

| Name | Notes |
|---|---|
| `DATABASE_URL` | Pooled Neon string |
| `RESEND_API_KEY` | From the JCK Resend account |
| `QUOTE_FROM_EMAIL` | `onboarding@resend.dev` until the domain is verified |
| `QUOTE_NOTIFICATION_EMAIL` | `curtis.jckhomefix@gmail.com` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ⚠️ **must NOT be marked sensitive** |
| `ADMIN_ACCESS_CODE` | 12+ characters, or `/admin` stays closed |

⚠️ **The sensitive-flag trap.** Vercel defaults Production variables to
"sensitive", which silently stops any `NEXT_PUBLIC_*` value being inlined into
the client bundle. It fails at runtime with no build error. Add public vars
with `--no-sensitive`, or untick the box in the dashboard.

## 3. Resend

1. Sign up with the JCK account.
2. Create an API key → `RESEND_API_KEY`.
3. Until DNS access exists, set `QUOTE_FROM_EMAIL=onboarding@resend.dev`.
   Note this only delivers to the address the Resend account is registered
   under — which is why that should be `curtis.jckhomefix@gmail.com`.
4. Once DNS is available: Domains → add `jckhomefixamerica.com` → add the 3
   records → then `QUOTE_FROM_EMAIL=quotes@jckhomefixamerica.com`.
   **No mailbox is needed** — verification is DNS-only, it just proves
   ownership.

## 4. Cloudinary

1. Sign up with the JCK account (free tier is 25GB, far beyond what this needs).
2. Dashboard → copy the **Cloud name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3. Create folders: `jck/projects/`, `jck/team/`, `jck/equipment/`, `jck/hero/`.
4. Never expose the API secret — only the cloud name is public.

## 5. Domain

`jckhomefixamerica.com` is registered and currently 301s to the old
WordPress.com staging site. Curtis controls it; credentials are still pending.

This blocks two separate things:
- pointing the real address at Vercel (**the launch blocker**), and
- verifying the Resend sending domain (cosmetic).

---

## Still blocking launch

1. **WA L&I registration number.** Not in the state registry under any name I
   could find. Call **1-800-647-0982**. Until it is set in `lib/business.ts`,
   the footer renders a "Not ready to launch" warning and the site stays
   `noindex` — see `allowIndexing` in that file.
2. **Domain credentials**, per above.
3. **Real photos.** `lib/projects.ts` and `lib/reviews.ts` are deliberately
   empty; nothing invented ships on a real business's site.
4. **Curtis's own words** for the About story — currently placeholder copy,
   marked with a comment in `app/about/page.tsx`.

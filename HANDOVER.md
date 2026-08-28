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
| **Neon** | JCK account | ✅ | delete the old personal project |
| **Vercel** | JCK account | ✅ | none |
| **Resend** | JCK account | ✅ | none |
| **Cloudinary** | JCK account | ✅ | none |

All five confirmed JCK-owned as of 2026-08-27. The only outstanding cleanup is
deleting the old Neon project from the personal org.

---

## 1. Neon — ✅ DONE (2026-08-27)

Now on a JCK-owned account. Endpoint `ep-dry-unit-aewrwcvu`, region
`aws-us-east-2`, database `neondb`. Schema applied and verified: a form
submission writes, and `/admin` reads it back.

Verified this is genuinely a separate account — the endpoint belongs to none
of the four projects in the personal org.

Region note: `us-east-2` while Vercel functions default to `us-east-1`. That
adds roughly 10–15ms to the one database round trip a submission makes.
Irrelevant here; not worth redoing.

**Remaining:**
- [ ] Set `DATABASE_URL` in Vercel to the new pooled string, and redeploy.
- [ ] Confirm `/admin` → System status → Database (Neon) is green.
- [ ] **Delete the old project** `jck-homefix` / `green-shape-89436142` from
      the personal Neon org. It holds only test rows.

## 2. Vercel — ✅ JCK-owned

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

## 3. Resend — ✅ JCK-owned

While `QUOTE_FROM_EMAIL=onboarding@resend.dev`, Resend delivers ONLY to the
address the account is registered under. Confirm that is
`curtis.jckhomefix@gmail.com`, or lead notifications go to the wrong inbox.

Once DNS access exists: Domains → add `jckhomefixamerica.com` → add the 3
records → set `QUOTE_FROM_EMAIL=quotes@jckhomefixamerica.com`. **No mailbox is
needed** — verification is DNS-only, it just proves ownership.

## 4. Cloudinary — ✅ JCK-owned

Folders to create: `jck/projects/`, `jck/team/`, `jck/equipment/`, `jck/hero/`.
Only the cloud name is public; never expose the API secret.

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

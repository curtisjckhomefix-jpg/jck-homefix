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
| **Neon** | JCK account | ✅ | none |
| **Vercel** | JCK account | ✅ | none |
| **Resend** | JCK account | ✅ | none |
| **Cloudinary** | JCK account | ✅ | none |
| **Cloudflare** | not created | ⬜ | Turnstile keys — free |
| **Upstash** | not created | ⬜ | Redis rate limiting — free |

**All five confirmed JCK-owned as of 2026-08-27.** Nothing belonging to this
site lives on a personal account any more.

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

The superseded personal-account project `green-shape-89436142` was deleted
2026-08-27 after confirming it held nothing but test rows.

**Remaining:**
- [ ] Set `DATABASE_URL` in Vercel to the JCK pooled string, and redeploy.
- [ ] Confirm `/admin` → System status → Database (Neon) is green.

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
| `CLOUDINARY_API_KEY` | Admin uploads. Server-only |
| `CLOUDINARY_API_SECRET` | Admin uploads. Server-only, never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ⚠️ **must NOT be marked sensitive** |
| `TURNSTILE_SECRET_KEY` | Turnstile enforces only once this is set |
| `UPSTASH_REDIS_REST_URL` | Falls back to in-memory without it |
| `UPSTASH_REDIS_REST_TOKEN` | |

⚠️ **The sensitive-flag trap.** Vercel defaults Production variables to
"sensitive", which silently stops any `NEXT_PUBLIC_*` value being inlined into
the client bundle. It fails at runtime with no build error. Add public vars
with `--no-sensitive`, or untick the box in the dashboard.

## 3. Resend — ✅ JCK-owned

### The sandbox limit (this is why extra recipients do not work yet)

While `QUOTE_FROM_EMAIL=onboarding@resend.dev`, Resend delivers **only to the
one address the Resend account is registered under**. Adding a second
recipient makes the whole send fail with a 403 — nobody gets it, not even the
first address. Confirmed in Resend's docs:
https://resend.com/docs/knowledge-base/403-error-resend-dev-domain

`QUOTE_NOTIFICATION_EMAIL` accepts a comma-separated list, but do not add a
second address until a domain is verified.

**Want a copy on another inbox today?** Use Gmail forwarding, not Resend:
`curtis.jckhomefix@gmail.com` → Settings → Forwarding and POP/IMAP → add the
other address. Zero code, works immediately, and leads still land in the
business inbox where they belong.

### Once DNS access exists

Domains → add `jckhomefixamerica.com` → add the 3 records → set
`QUOTE_FROM_EMAIL=quotes@jckhomefixamerica.com`. **No mailbox is needed** —
verification is DNS-only, it just proves ownership. After that,
`QUOTE_NOTIFICATION_EMAIL` can list as many recipients as you like.

## 4. Cloudinary — ✅ JCK-owned

Folders to create: `jck/projects/`, `jck/team/`, `jck/equipment/`, `jck/hero/`.
Only the cloud name is public; never expose the API secret.

**To test it:**

```bash
pnpm check-cloudinary                 # reads .env.local
pnpm check-cloudinary <cloud-name>    # or pass it directly
pnpm check-cloudinary <cloud> jck/team/curtis   # check your own asset
```

It fetches the account's built-in `sample` image through four transformation
URLs — raw delivery, `f_auto,q_auto`, a resize, and a blur placeholder — and
confirms each returns a real image. A wrong cloud name 404s on all four.

## 5. Managing content (/admin)

Curtis manages these himself — no code changes needed:

| Section | What it does |
|---|---|
| `/admin` | Incoming leads, click-to-call, status tracking |
| `/admin/gallery` | Before/after project photos |
| `/admin/reviews` | Customer reviews |
| `/admin/branding` | Site logo |

**Photo uploads** go: pick a file → the browser shrinks it (longest edge 2000px,
JPEG q82) → the server mints a signed Cloudinary upload → the browser uploads
DIRECTLY to Cloudinary. Nothing large passes through Vercel, which caps request
bodies around 4.5MB — a phone photo would routinely exceed that.

Requires `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in Vercel. Both are
server-only; prefixing either with `NEXT_PUBLIC_` would publish your secret to
every visitor.

**Everything defaults to DRAFT.** New projects and reviews are invisible on the
public site until Published is ticked. That is the schema enforcing the
no-fabricated-content rule rather than trusting anyone to remember it.

## 6. Bot protection & rate limiting

Both are wired in and both **degrade gracefully** — the form works today with
neither configured. Create the accounts under JCK like everything else.

### Cloudflare Turnstile (free)

dash.cloudflare.com → Turnstile → Add site → domain `jckhomefixamerica.com`
(add `localhost` too for local testing). Copy both keys into Vercel.

Until `TURNSTILE_SECRET_KEY` is set the form is protected only by the honeypot
and time-trap. Those held for a while on the other sites and then stopped —
expect to need this eventually, not immediately.

### Upstash Redis (free)

console.upstash.com → Create Database → REST API → copy URL and token.

Without it the limiter counts in-process, which does not work across
serverless instances: five function instances means five separate counters.

### Failure modes, chosen deliberately

Both **fail OPEN**. If Cloudflare or Upstash is unreachable, the submission is
allowed through and the failure is logged loudly.

This is the right trade-off *for this site specifically*: someone standing in
a flooded hallway at 2am must not be turned away because a third-party service
had an outage. Taking some spam is survivable; dropping a real emergency lead
is not. An ordinary signup form should fail closed here — this one should not.

Verified against Cloudflare's official test keys: an always-fail secret gives
403, an always-pass secret gives 200, a missing token when configured gives
403, and no configuration at all still accepts leads.

## 7. Domain

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

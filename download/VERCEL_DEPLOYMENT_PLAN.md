# Vercel Deployment Plan — Aura Living

> **Goal**: Deploy the complete Aura Living backend to production on Vercel.
> **Estimated time**: 30 minutes
> **Cost**: $0 (all free tiers)

---

## Pre-Deployment Checklist

Before starting, verify you have access to these accounts:

- [ ] **GitHub** — your code is at `hamzaaftab325-eng/aura-living`
- [ ] **Vercel** — https://vercel.com (sign in with GitHub)
- [ ] **Supabase** — project `jrjhonvpkhimpajmjtmq` (Singapore region)
- [ ] **Resend** — API key `re_94VWtM72_8dqRmyeEY7gAXs7xeqUec9w4`
- [ ] **Cloudinary** — cloud name `diometfe9`
- [ ] **Your database password** — `Cobalt!Tree#981`

---

## Step 1: Push Code to GitHub (5 minutes)

### If you have uncommitted changes:

```bash
cd /home/z/my-project
git add -A
git commit -m "Phase 7: Production hardening — newsletter DB, shop page migration, wishlist sync, rate limiting, SEO, loading skeletons

- Newsletter form now saves to NewsletterSubscriber table
- Shop page now fetches products from DB (was mock data)
- Wishlist syncs from localStorage to DB on login
- In-memory rate limiting on /api/checkout, /api/newsletter
- robots.txt disallows /api/, /admin/, /account/, /auth/, /checkout/
- Loading skeletons for /admin, /account, /shop
- All typecheck + lint + build pass with 0 errors"
git push origin main
```

### Verify on GitHub:
1. Go to https://github.com/hamzaaftab325-eng/aura-living
2. Confirm the latest commit is visible
3. Check that `.env.local` is NOT in the repo (it's gitignored)

---

## Step 2: Import Project to Vercel (5 minutes)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Find `hamzaaftab325-eng/aura-living`
4. Click **"Import"**

### Configure project:
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**DO NOT click "Deploy" yet** — we need to add environment variables first.

---

## Step 3: Add Environment Variables (10 minutes)

This is the **most critical step**. Vercel build will fail if any env var is missing.

In the Vercel project setup page, scroll to **"Environment Variables"** and add each of these:

### Database (Required)
| Name | Value | Environments |
|------|-------|--------------|
| `DATABASE_URL` | `postgresql://postgres.jrjhonvpkhimpajmjtmq:Cobalt%21Tree%23981@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Production, Preview, Development |
| `DIRECT_URL` | `postgresql://postgres.jrjhonvpkhimpajmjtmq:Cobalt%21Tree%23981@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres` | Production, Preview, Development |

**⚠️ IMPORTANT**: The password `!` must be URL-encoded as `%21` and `#` as `%23`.

### Auth (Required)
| Name | Value | Environments |
|------|-------|--------------|
| `AUTH_SECRET` | `cLQjSEFhSpdNpcGOwUsrATMpSPKL6zbCB8aKMBbWDtM=` | Production, Preview, Development |
| `AUTH_URL` | `https://aura-living-two.vercel.app` | Production |

> **Note**: For `AUTH_URL`, use your Vercel URL. If you already have a Vercel deployment, use that URL. Otherwise, deploy first without it, then update after you get the URL.

### Email — Resend (Required)
| Name | Value | Environments |
|------|-------|--------------|
| `RESEND_API_KEY` | `re_94VWtM72_8dqRmyeEY7gAXs7xeqUec9w4` | Production, Preview, Development |
| `EMAIL_FROM` | `Aura Living <onboarding@resend.dev>` | Production, Preview, Development |

> **Note**: `onboarding@resend.dev` can only send to YOUR email (hamzaaftab325@gmail.com). For production (sending to customers), verify your domain at https://resend.com/domains and update this to `Aura Living <noreply@auraliving.pk>`.

### Cloudinary (Required for image upload)
| Name | Value | Environments |
|------|-------|--------------|
| `CLOUDINARY_CLOUD_NAME` | `diometfe9` | Production, Preview, Development |
| `CLOUDINARY_API_KEY` | `557379872884882` | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | `rNr_wVZdo-Vxdu0VvRn-aNty29g` | Production, Preview, Development |

### Client-safe (Required)
| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_APP_URL` | `https://aura-living-two.vercel.app` | Production |
| `NEXT_PUBLIC_CURRENCY` | `PKR` | Production, Preview, Development |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `diometfe9` | Production, Preview, Development |

### Optional (Placeholder — can skip)
| Name | Value | Environments |
|------|-------|--------------|
| `UPSTASH_REDIS_REST_URL` | (leave empty for now) | — |
| `UPSTASH_REDIS_REST_TOKEN` | (leave empty for now) | — |

> These are for future rate-limiting upgrade. In-memory rate limiting works for now.

---

## Step 4: Deploy (5 minutes)

1. Click **"Deploy"** in Vercel
2. Wait for build to complete (~3-5 minutes)
3. Vercel will show "Congratulations" screen with your URL:
   `https://aura-living-two.vercel.app`

### If build fails:
- Check Vercel build logs
- Most common issue: missing env var → add it and redeploy
- Second most common: Prisma client not generated → Vercel auto-runs `prisma generate` via postinstall

---

## Step 5: Run Database Migration on Production (2 minutes)

After deployment, run the Prisma migration to ensure production DB schema matches:

### Option A: Via Vercel CLI (recommended)
```bash
npm i -g vercel
vercel login
vercel link  # link to your aura-living project
vercel env pull .env.production.local  # downloads production env vars
npx prisma migrate deploy
```

### Option B: Via Supabase Dashboard
1. Your DB is already migrated (we ran `prisma db push` during development)
2. No action needed — the schema is already live in Supabase

---

## Step 6: Promote Yourself to Admin (2 minutes)

After deployment, you need to promote your user to ADMIN role on the production DB:

### Via Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Open project `jrjhonvpkhimpajmjtmq`
3. Click **Table Editor** → **User** table
4. Find your user (`hamzaaftab325@gmail.com`)
5. Set:
   - `emailVerified` = `true`
   - `role` = `ADMIN`
6. Click **Save**

### Or via script (run locally with production env vars):
```bash
npx tsx scripts/promote-admin.ts hamzaaftab325@gmail.com
```

---

## Step 7: Verify Production (5 minutes)

Visit your production URL and test these flows:

### Public pages:
- [ ] https://aura-living-two.vercel.app/ — homepage loads
- [ ] https://aura-living-two.vercel.app/shop — shop loads with 45 products
- [ ] https://aura-living-two.vercel.app/product/hammered-brass-table-lamp — product detail loads

### Auth flows:
- [ ] https://aura-living-two.vercel.app/auth/signup — create new account
- [ ] Check email for verification link (if Resend domain verified)
- [ ] https://aura-living-two.vercel.app/auth/login — log in
- [ ] https://aura-living-two.vercel.app/account — dashboard shows user info

### Admin flows:
- [ ] https://aura-living-two.vercel.app/admin — dashboard loads (you must be ADMIN)
- [ ] https://aura-living-two.vercel.app/admin/products — 45 products listed
- [ ] https://aura-living-two.vercel.app/admin/orders — orders listed
- [ ] https://aura-living-two.vercel.app/admin/coupons — WELCOME10 + AURA500 visible

### Checkout flow:
- [ ] Add product to cart
- [ ] Go to /checkout — fill form
- [ ] Place order — should redirect to /checkout/success
- [ ] Check email for order confirmation
- [ ] Check Supabase → Order table — order appears

### Newsletter:
- [ ] Scroll to homepage footer
- [ ] Enter email in newsletter form
- [ ] Submit — should show success message
- [ ] Check Supabase → NewsletterSubscriber table — email appears

---

## Step 8: Post-Deployment Security (5 minutes)

### Rotate shared secrets (recommended):
Since you shared these in chat, rotate them after deployment is verified:

1. **Supabase DB password**:
   - Supabase Dashboard → Settings → Database → Reset password
   - Update Vercel env vars `DATABASE_URL` + `DIRECT_URL` with new password (URL-encoded)
   - Redeploy

2. **Resend API key**:
   - https://resend.com/api-keys → Revoke old key → Create new
   - Update Vercel env var `RESEND_API_KEY`
   - Redeploy

3. **Cloudinary API Secret**:
   - Cloudinary Dashboard → Settings → Security → Rotate API Secret
   - Update Vercel env vars `CLOUDINARY_API_SECRET` + `CLOUDINARY_URL`
   - Redeploy

4. **AUTH_SECRET** (optional, but good practice):
   - Generate new: `openssl rand -base64 32`
   - Update Vercel env var `AUTH_SECRET`
   - Redeploy
   - ⚠️ This will log out all users (they'll need to log in again)

---

## Step 9: Set Up Custom Domain (Future — when you buy a domain)

When you buy a domain (e.g., `auraliving.pk`):

1. **Vercel**: Project Settings → Domains → Add `auraliving.pk`
2. **DNS**: Add CNAME record pointing to `cname.vercel-dns.com`
3. **Update env vars**:
   - `AUTH_URL` = `https://auraliving.pk`
   - `NEXT_PUBLIC_APP_URL` = `https://auraliving.pk`
4. **Update Resend**: Verify domain at https://resend.com/domains
5. **Update `EMAIL_FROM`**: `Aura Living <noreply@auraliving.pk>`
6. **Update sitemap**: Change `baseUrl` in `src/app/sitemap.ts`
7. **Update robots.ts**: Change `sitemap` + `host` URLs
8. **Redeploy**

---

## Troubleshooting

### Build fails with "prisma generate" error
Vercel should auto-run `prisma generate` via the `postinstall` script in package.json. If it doesn't:
1. Add to `package.json` scripts: `"postinstall": "prisma generate"`
2. Redeploy

### Build fails with "DATABASE_URL not set"
- Verify the env var is set in Vercel for ALL environments (Production, Preview, Development)
- Vercel caches builds — try "Redeploy" with "Use existing build cache" unchecked

### Auth doesn't work on production (login fails)
- Check `AUTH_URL` matches your Vercel URL (https, not http)
- Check `AUTH_SECRET` is set and is 32+ chars
- Check browser console for cookie errors

### Images don't upload (admin product form)
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are all set
- Check Vercel function logs for the `/api/admin/upload` route

### Emails don't send
- Verify `RESEND_API_KEY` is set
- Check that the recipient email is YOUR email (hamzaaftab325@gmail.com) — `onboarding@resend.dev` can only send to the account owner
- For customer emails, verify your domain at resend.com/domains

### Orders don't appear in DB
- Check Vercel function logs for `/api/checkout`
- Verify `DATABASE_URL` uses the pooled connection (port 6543)
- Check that the user is logged in (checkout requires auth)

### 500 error on any page
- Check Vercel function logs (Vercel Dashboard → Project → Functions tab)
- Most common: missing env var or DB connection issue

---

## Vercel Free Tier Limits

| Resource | Free Tier Limit | Aura Living Expected Usage |
|----------|----------------|---------------------------|
| Bandwidth | 100 GB/month | ~5 GB (1000 visitors × 5MB) |
| Build time | 6000 minutes/month | ~30 min/build |
| Serverless function calls | 100K/month | ~5K |
| Serverless function duration | 10s max | Most complete in <2s |
| Edge requests | 1M/month | ~10K |

**You won't hit any limits** unless you get 10,000+ visitors per month.

---

## Monitoring After Deployment

### Vercel Analytics (free, already installed)
- Vercel Dashboard → Project → Analytics tab
- Shows: page views, unique visitors, top pages, Web Vitals

### Vercel Speed Insights (free, already installed)
- Vercel Dashboard → Project → Speed Insights tab
- Shows: LCP, INP, CLS per route

### Supabase Dashboard
- Database → Logs — query logs, error logs
- Reports — DB size, connections

### Resend Dashboard
- https://resend.com/emails — sent emails, bounce rate, delivery status

---

## ✅ Deployment Complete!

After all steps, your site is live at:
**https://aura-living-two.vercel.app**

### What's Live:
- ✅ 45 products from Supabase database
- ✅ Real authentication (signup, login, email verification, password reset)
- ✅ Real orders (COD checkout in PKR)
- ✅ Order confirmation emails via Resend
- ✅ Admin dashboard (products, orders, customers, coupons)
- ✅ Image upload to Cloudinary
- ✅ Newsletter subscription
- ✅ Rate limiting on critical endpoints
- ✅ SEO-optimized (sitemap, robots.txt, per-page metadata)

### What's Not Yet (Future):
- ⏳ Custom domain (when you buy one)
- ⏳ Upstash Redis for distributed rate limiting (in-memory works for now)
- ⏳ Sentry error monitoring (optional)
- ⏳ Online payment (Stripe/JazzCash — currently COD only)

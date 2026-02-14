# Pre-Deployment Checklist

Run this checklist before deploying to production or making significant changes.

## 1. Schema Validation

**Purpose:** Ensure Prisma schema matches webhook and API expectations.

```bash
npm run validate:schema
```

**What it checks:**
- ✅ `stripeCustomerId` exists in User model
- ✅ `stripeSubscriptionId` exists in User model
- ✅ `stripePriceId` exists in User model
- ✅ `stripeCurrentPeriodEnd` exists in User model

**Why it matters:** The Stripe webhook (`src/app/api/stripe/webhook/route.ts`) assumes these fields exist. Missing fields = runtime errors when customers pay.

---

## 2. Type Safety

```bash
npm run type-check
```

**What it checks:**
- TypeScript compilation without errors
- Type mismatches across components
- Missing type definitions

---

## 3. Code Quality

```bash
npm run lint
```

**What it checks:**
- ESLint rules compliance
- Code style consistency
- Potential bugs

---

## 4. Build Validation

```bash
npm run build
```

**What it checks:**
- Next.js builds successfully
- No build-time errors
- All pages compile

---

## 5. Environment Variables

Verify all required env vars are set in production:

- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `NEXTAUTH_SECRET` - Random secret for auth
- ✅ `NEXTAUTH_URL` - Production URL
- ✅ `GOOGLE_CLIENT_ID` - Google OAuth
- ✅ `GOOGLE_CLIENT_SECRET` - Google OAuth
- ✅ `GITHUB_CLIENT_ID` - GitHub OAuth
- ✅ `GITHUB_CLIENT_SECRET` - GitHub OAuth
- ✅ `STRIPE_SECRET_KEY` - Stripe API key
- ✅ `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- ✅ `ANTHROPIC_API_KEY` - Claude AI API key
- ✅ `RESEND_API_KEY` - Email sending

---

## 6. Database Migrations

```bash
npx prisma migrate deploy
```

**What it does:**
- Applies pending migrations to production database
- Ensures schema is up to date

---

## Quick Pre-Deploy Command

Run all checks at once:

```bash
npm run validate:schema && npm run type-check && npm run lint && npm run build
```

If all pass, you're ready to deploy! 🚀

---

## Post-Deployment Verification

After deploying:

1. ✅ Test auth flow (Google + GitHub login)
2. ✅ Test Stripe payment (use test mode card: 4242 4242 4242 4242)
3. ✅ Verify webhook receives events (check Vercel logs)
4. ✅ Test AI integration on dashboard
5. ✅ Check error monitoring dashboard

---

## Common Issues

### Schema validation fails
**Fix:** Update `prisma/schema.prisma` to include missing Stripe fields, then run `npx prisma generate`.

### Build fails with type errors
**Fix:** Run `npm run type-check` to see detailed errors. Usually missing types or wrong imports.

### Webhook returns 500
**Fix:** Check Vercel logs. Usually means DATABASE_URL is wrong or schema is out of sync.

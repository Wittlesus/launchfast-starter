# LaunchFast Deployment Strategy

**Last updated:** 2026-02-14

## Two Separate Deployments

LaunchFast uses **two different deployments** for different purposes:

### 1. GitHub Pages (Marketing Site) ✅ PRIMARY
**URL:** https://wittlesus.github.io/launchfast-starter/

**Purpose:** Public marketing website for selling the product

**Branch:** `gh-pages`

**Contents:**
- Static HTML landing pages
- Product descriptions, pricing, FAQ
- SEO content pages (Next.js vs alternatives, deployment costs, etc.)
- Comparison guides and tutorials

**Pricing shown:**
- $79 Starter (1 project license)
- $119 Pro (unlimited projects, priority support)
- $99 Complete Bundle (all products)

**Why this is the primary deployment:**
- Optimized for SEO and organic traffic
- Static HTML loads faster than Next.js
- No server costs (GitHub Pages is free)
- Customers see this FIRST when searching for Next.js boilerplates

---

### 2. Vercel (Demo App) ⚠️ SECONDARY
**URL:** https://launchfast-starter.vercel.app

**Purpose:** Live demo of the actual Next.js boilerplate in action

**Branch:** `master`

**Contents:**
- Running Next.js 16 application
- Functional authentication (Google/GitHub OAuth)
- Working dashboard and protected routes
- Demonstrates the product customers will receive

**Pricing shown:**
- ✅ MUST match GitHub Pages pricing exactly
- $79 Starter (boilerplate features, not SaaS features)
- $119 Pro (unlimited projects, not "unlimited requests")
- ❌ NO Enterprise tier ($299) - this doesn't exist

**Why this exists:**
- Lets developers see the boilerplate running live before buying
- Demonstrates authentication flow, dashboard, components
- Shows code quality and UI polish
- Validates "it actually works" for skeptical buyers

---

## Critical: Pricing Must Be Consistent

**The Problem:**
The Vercel deployment was showing **SaaS-style pricing** with features like:
- ❌ "Up to 100 requests/month" (this is a template, not a hosted service!)
- ❌ "API access" (customers get the source code, not API access)
- ❌ "Advanced analytics" (not relevant for a boilerplate)
- ❌ Enterprise tier at $299 (doesn't exist)

**This was fraudulent messaging** because:
1. LaunchFast is a **boilerplate/template**, not a SaaS
2. Customers buy **source code access**, not hosted service quotas
3. "Requests/month" makes no sense for a template you download and run yourself

**The Fix:**
Updated `src/lib/stripe.ts` to show **boilerplate features**:
- ✅ "Full Next.js 16 SaaS boilerplate"
- ✅ "NextAuth v5 with Google & GitHub OAuth"
- ✅ "1 project license" (Starter) / "Unlimited project license" (Pro)
- ✅ Changed payment mode from "subscription" to "payment" (one-time)

---

## Deployment Checklist

Before deploying to either platform, verify:

### GitHub Pages (gh-pages branch)
- [ ] Pricing matches: $79 Starter, $119 Pro, $99 Bundle
- [ ] Features are boilerplate-specific (source code, integrations, licenses)
- [ ] All links point to Stripe payment URLs (not Vercel checkout)
- [ ] No "subscription" or "monthly" language
- [ ] SEO tags are optimized (meta descriptions, OG tags)

### Vercel (master branch)
- [ ] Pricing matches GitHub Pages exactly
- [ ] `src/lib/stripe.ts` PLANS array has boilerplate features
- [ ] Payment mode is "payment" not "subscription"
- [ ] No Enterprise tier shown
- [ ] Demo functionality works (auth, dashboard, etc.)

---

## For QA/Testing

**When testing pricing, check BOTH deployments:**

1. **GitHub Pages** (https://wittlesus.github.io/launchfast-starter/)
   - This is what customers see first
   - Pricing must be clear and accurate
   - Links should work

2. **Vercel** (https://launchfast-starter.vercel.app)
   - This is the live demo
   - Pricing must match GitHub Pages
   - No SaaS-style features allowed

**If you see a mismatch:**
- GitHub Pages is the source of truth
- Vercel must be updated to match
- Update `src/lib/stripe.ts` on master branch
- Git push triggers automatic Vercel redeploy

---

## Why Two Deployments?

**Couldn't we use just one?**

Option A: **Only Vercel** (running Next.js app)
- ❌ Slower than static HTML
- ❌ Costs money to run server
- ❌ Worse SEO than static pages
- ❌ More complex to maintain

Option B: **Only GitHub Pages** (static HTML)
- ❌ Can't demonstrate live functionality
- ❌ Customers can't try auth flow before buying
- ❌ No proof the boilerplate actually works

**Solution: Both** (GitHub Pages for marketing + Vercel for demo)
- ✅ Fast static pages for SEO
- ✅ Live demo for credibility
- ✅ Free hosting (GitHub Pages)
- ✅ Automatic deploys (both platforms)

The two-deployment strategy gives us the best of both worlds.

---

## Common Mistakes

### ❌ WRONG: "Vercel pricing is different because it's the demo"
No. Pricing must be identical. The demo shows what customers will build with the boilerplate, including the pricing page. If pricing differs, customers get confused.

### ❌ WRONG: "SaaS features on Vercel are just placeholder examples"
No. This is fraud. We're selling a boilerplate, not a SaaS. Features must accurately describe what customers receive (source code, licenses, support).

### ✅ CORRECT: "Both deployments show identical pricing for the boilerplate"
Yes. GitHub Pages and Vercel must have the same pricing, same features, same messaging. The only difference is static HTML vs running Next.js app.

---

## Deployment Commands

```bash
# Deploy to GitHub Pages (marketing site)
git checkout gh-pages
git add .
git commit -m "Update marketing content"
git push origin gh-pages
# Deploys automatically to https://wittlesus.github.io/launchfast-starter/

# Deploy to Vercel (demo app)
git checkout master
git add .
git commit -m "Update boilerplate code"
git push origin master
# Deploys automatically to https://launchfast-starter.vercel.app
```

---

**TL;DR:**
- **GitHub Pages** = Marketing site (static HTML, SEO-optimized)
- **Vercel** = Live demo (running Next.js app, proves it works)
- **Pricing** = Must be identical on both
- **Features** = Boilerplate features only (no SaaS quotas/limits)

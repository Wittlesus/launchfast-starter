# LaunchFast Repository Structure

**Last updated:** 2026-02-14

## Branch Overview

This repository uses **two separate branches** for different purposes:

### 1. `master` branch (Product Source Code)
**Purpose:** Contains the full Next.js SaaS boilerplate that customers purchase.

**Contents:**
- ✅ Complete Next.js 16 application source code (26+ TypeScript/TSX files)
- ✅ `src/` directory with full application structure
- ✅ Authentication, payments, database, AI integration
- ✅ All dependencies, configuration, and documentation
- ✅ Prisma schema, middleware, API routes, components

**What customers get:**
- Access to this branch after purchase
- Full source code to clone and customize
- All TypeScript/TSX files
- Complete development environment

**Directory structure:**
```
master branch/
├── src/                    ← Full application source code
│   ├── app/               ← Next.js App Router pages
│   ├── components/        ← React components
│   ├── lib/              ← Utilities (auth, stripe, prisma, email)
│   └── middleware.ts     ← Route protection
├── prisma/
│   └── schema.prisma     ← Database schema
├── package.json          ← Dependencies
├── next.config.ts        ← Next.js config
├── tailwind.config.ts    ← Tailwind config
└── README.md             ← Full documentation
```

**File count:**
- 26 TypeScript/TSX source files
- Full Next.js project structure
- Production-ready codebase

---

### 2. `gh-pages` branch (Marketing Website)
**Purpose:** Hosts the public marketing website on GitHub Pages.

**Contents:**
- ✅ Static HTML landing pages
- ✅ Product descriptions, pricing, FAQ
- ✅ SEO content pages, comparison guides
- ✅ No application source code (intentionally)

**What this branch is for:**
- Public-facing marketing site at https://wittlesus.github.io/launchfast-starter/
- Accessible to anyone (free to view)
- Drives traffic to the product

**Directory structure:**
```
gh-pages branch/
├── index.html              ← Main landing page
├── pagebrain.html          ← PageBrain product page
├── pricing.html            ← Pricing page
├── alternatives.html       ← Comparison pages
├── nextjs-*.html          ← SEO content pages
└── sitemap.xml            ← SEO sitemap
```

**File count:**
- 20+ HTML files
- No src/ directory (this is normal)
- No application source code (this is intentional)

---

## Important Notes for QA/Testing

### ❌ Common Confusion
**Issue:** "The repository has no src/ directory!"

**Resolution:** You're looking at the wrong branch. The `gh-pages` branch is for marketing HTML only. Switch to `master` branch to see the source code.

**How to verify source code exists:**
```bash
# Switch to master branch
git checkout master

# List source files
find src -name "*.ts" -o -name "*.tsx"

# Should return 26+ files
```

### ✅ Correct Testing Approach

**To test the product (LaunchFast SaaS Starter):**
1. Checkout `master` branch
2. Verify `src/` directory exists
3. Count source files (should be 26+)
4. Check README.md for setup instructions

**To test the marketing site:**
1. Checkout `gh-pages` branch
2. Verify HTML files exist
3. Check links and CTAs
4. Visit https://wittlesus.github.io/launchfast-starter/

---

## Why Two Branches?

**Separation of concerns:**
- **master** = Product (what customers buy)
- **gh-pages** = Marketing (how we sell it)

**Benefits:**
1. Marketing site can be freely accessible without exposing private code structure
2. Different deployment pipelines (gh-pages deploys to GitHub Pages automatically)
3. Clean separation between product and marketing content
4. Easy to update marketing without touching product code

---

## Source Code Verification Checklist

Use this checklist when auditing the LaunchFast product:

- [ ] On `master` branch (not `gh-pages`)
- [ ] `src/` directory exists
- [ ] At least 26 TypeScript/TSX files in `src/`
- [ ] `prisma/schema.prisma` exists
- [ ] `package.json` has Next.js, Prisma, Stripe, NextAuth
- [ ] README.md documents full setup process
- [ ] GitHub repo is public and accessible
- [ ] Landing page (gh-pages) links to source code

**All checks should pass.** If any fail, you're likely on the wrong branch.

---

## For Customers

**After purchase, you receive:**
1. Access to the `master` branch source code
2. Full TypeScript/TSX codebase (src/ directory)
3. All configuration files and documentation
4. Ability to clone, customize, and deploy

**You do NOT receive:**
- The marketing HTML files (those are free on gh-pages)
- Just static pages (the actual product is the Next.js app)

**The source code is open and viewable BEFORE purchase at:**
https://github.com/Wittlesus/launchfast-starter (master branch)

---

## FAQ for Auditors/Testers

**Q: Where's the source code?**
A: `master` branch, `src/` directory. If you don't see it, run `git checkout master`.

**Q: Why does gh-pages have no src/ directory?**
A: gh-pages is for marketing HTML only. It's not supposed to have source code.

**Q: Is this fraud? The repo looks empty!**
A: No. You're on the wrong branch. Switch to `master` to see the 26+ source files.

**Q: Can customers actually access the source?**
A: Yes. The GitHub repo is public. Anyone can view the code before buying. After purchase, they get official access/license.

**Q: How do I verify the product exists?**
A: `git checkout master && ls src/` should show the full app structure.

---

## Branch Switching Commands

```bash
# See all branches
git branch -a

# Switch to master (product source code)
git checkout master

# Switch to gh-pages (marketing site)
git checkout gh-pages

# Count source files on master
git checkout master && find src -name "*.ts" -o -name "*.tsx" | wc -l

# List marketing pages on gh-pages
git checkout gh-pages && ls *.html
```

---

**If you're testing LaunchFast and see "no source code," you're on the wrong branch. Switch to `master`.**

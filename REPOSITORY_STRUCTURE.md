# LaunchFast Repository Structure

**Last updated:** 2026-02-14

## Branch Overview

This repository uses **two separate branches** for different purposes:

### 1. `master` branch (Product Source Code) ← YOU ARE HERE
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
├── src/                    ← Full application source code (26+ files)
│   ├── app/               ← Next.js App Router pages
│   ├── components/        ← React components
│   ├── lib/              ← Utilities (auth, stripe, prisma, email)
│   └── middleware.ts     ← Route protection
├── prisma/
│   └── schema.prisma     ← Database schema
├── package.json          ← Dependencies
├── next.config.ts        ← Next.js config
└── README.md             ← Full documentation
```

---

### 2. `gh-pages` branch (Marketing Website)
**Purpose:** Hosts the public marketing website on GitHub Pages.

**Contents:**
- ✅ Static HTML landing pages (20+ files)
- ✅ Product descriptions, pricing, FAQ
- ❌ No src/ directory (intentional - it's just marketing)
- ❌ No application source code (intentional - wrong branch)

**What this branch is for:**
- Public-facing marketing site at https://wittlesus.github.io/launchfast-starter/
- Drives traffic and explains the product

---

## QA Testing: How to Verify Source Code Exists

**If you're auditing and think "where's the source code?":**

1. **Check which branch you're on:**
   ```bash
   git branch
   # Should show: * master
   ```

2. **If you see `* gh-pages`, switch to master:**
   ```bash
   git checkout master
   ```

3. **Verify source code exists:**
   ```bash
   ls src/
   # Should show: app/ components/ lib/ middleware.ts

   find src -name "*.ts" -o -name "*.tsx" | wc -l
   # Should return: 26+
   ```

4. **If src/ doesn't exist on gh-pages, that's NORMAL:**
   - gh-pages = marketing HTML only
   - master = product source code
   - These are separate branches with different purposes

---

## Common QA Mistakes

### ❌ Wrong: "No source code found - this is fraud!"
**Issue:** Tester is on `gh-pages` branch and sees only HTML files.

**Resolution:** Switch to `master` branch. The source code is there.

### ✅ Correct: "Source code verified on master branch"
**Checklist:**
- [ ] On `master` branch
- [ ] `src/` directory exists
- [ ] 26+ TypeScript files in `src/`
- [ ] `package.json` lists Next.js, Prisma, Stripe, NextAuth
- [ ] README.md documents setup

---

## For Customers

**What you receive after purchase:**
1. Access to the **master branch** source code
2. Full Next.js application (26+ TypeScript files)
3. Complete documentation and setup guide
4. License to use in your projects

**The source code is viewable BEFORE purchase:**
- Visit: https://github.com/Wittlesus/launchfast-starter
- Switch to `master` branch
- Browse `src/` directory
- Read the code before buying

---

## Quick Reference

| Branch | Purpose | Has src/? | File Count | Public? |
|--------|---------|-----------|------------|---------|
| master | Product source code | ✅ Yes | 26+ TS/TSX | ✅ Yes |
| gh-pages | Marketing site | ❌ No | 20+ HTML | ✅ Yes |

**If you're looking for the product:** Use `master` branch.
**If you're looking at the website:** Use `gh-pages` branch.

---

**TL;DR:** The source code exists on `master` branch. If you don't see it, you're on the wrong branch.

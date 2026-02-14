# Security Best Practices

**Last updated:** 2026-02-14

## Environment Variables

### ⚠️ CRITICAL: .env File Security

**NEVER commit .env to git:**
- The `.env` file is in `.gitignore` and should NEVER be tracked
- If you accidentally commit `.env`, you must:
  1. Remove it from git history: `git rm --cached .env`
  2. Force push (⚠️ WARNING: destructive): `git push --force`
  3. Rotate ALL secrets (API keys, database passwords, etc.)

**Use .env.example as a template:**
- `.env.example` is tracked in git and safe to share
- It should contain placeholder values that are **clearly invalid**
- Never use actual secrets in `.env.example`

### AUTH_SECRET Security

**NextAuth.js requires a cryptographically strong secret:**

❌ **WRONG - Weak secrets:**
```bash
AUTH_SECRET=development-secret-change-in-production
AUTH_SECRET=your-auth-secret-here
AUTH_SECRET=12345678
AUTH_SECRET=secret
```

✅ **CORRECT - Strong random secret:**
```bash
# Generate with npx auth secret (recommended)
npx auth secret

# Or use openssl
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Why this matters:**
- Weak secrets can be brute-forced
- Session tokens are signed with this secret
- If compromised, attackers can forge sessions and impersonate users
- NextAuth.js will **refuse to start** in production without a strong secret

### API Keys and Secrets Checklist

Before deploying to production, verify ALL of these:

- [ ] `AUTH_SECRET` is a random 32+ character string (not a placeholder)
- [ ] `GOOGLE_CLIENT_SECRET` is from Google Cloud Console (not "placeholder")
- [ ] `GITHUB_CLIENT_SECRET` is from GitHub OAuth Apps (not "placeholder")
- [ ] `STRIPE_SECRET_KEY` starts with `sk_live_` (not `sk_test_`)
- [ ] `STRIPE_WEBHOOK_SECRET` starts with `whsec_` (actual webhook secret)
- [ ] `DATABASE_URL` uses production credentials (not localhost)
- [ ] `ANTHROPIC_API_KEY` is a real API key (not "sk-ant-placeholder")
- [ ] `RESEND_API_KEY` is a real API key (not "re_placeholder")
- [ ] `EMAIL_FROM` is a verified domain (not "noreply@yourdomain.com")

### Environment-Specific Variables

**Development (.env):**
- Uses test/development API keys
- Local database (localhost)
- HTTP URLs allowed
- Weak secrets acceptable for local testing

**Production (Vercel/hosting platform):**
- Production API keys only
- Remote database with strong password
- HTTPS URLs required
- Strong random secrets mandatory

### Vercel Deployment

**Add environment variables in Vercel dashboard:**
1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.example`
3. Use production values (not placeholders)
4. Set scope to "Production" for production secrets

**Never:**
- Don't paste `.env` file directly into Vercel
- Don't use test keys in production
- Don't share Vercel environment variable screenshots (they contain secrets)

---

## Database Security

### Connection Strings

❌ **WRONG - Default passwords:**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/db
DATABASE_URL=postgresql://admin:admin@localhost:5432/db
```

✅ **CORRECT - Strong credentials:**
```bash
DATABASE_URL=postgresql://prod_user:$(openssl rand -base64 32)@db.example.com:5432/prod_db?sslmode=require
```

**Best practices:**
- Use SSL/TLS (`sslmode=require`)
- Strong random passwords (32+ characters)
- Rotate credentials quarterly
- Use connection pooling (Prisma handles this)
- Never use `trust` authentication in production

---

## Stripe Security

### API Keys

**Test vs Live:**
```bash
# Development
STRIPE_SECRET_KEY=sk_test_... # Test mode (safe for development)

# Production
STRIPE_SECRET_KEY=sk_live_... # Live mode (REAL MONEY)
```

**Webhook Secrets:**
- Each environment needs its own webhook secret
- Test webhooks use `whsec_test_...`
- Live webhooks use `whsec_...` (no "test" prefix)
- Create separate webhook endpoints for dev/prod

**Never:**
- Don't use live keys in development
- Don't log Stripe keys (even in crash reports)
- Don't share webhook secrets in Slack/email
- Don't use the same webhook secret across environments

---

## OAuth Security

### Redirect URLs

**Must match exactly:**
```bash
# Development
http://localhost:3000/api/auth/callback/google

# Production
https://yourdomain.com/api/auth/callback/google
```

**Common mistakes:**
- Forgetting to add production URL to OAuth provider
- Using HTTP in production (must be HTTPS)
- Trailing slashes (Google: strict, GitHub: flexible)

### Client Secrets

**Google OAuth:**
- Download JSON from Google Cloud Console
- Use `client_secret` field
- Never commit this file to git

**GitHub OAuth:**
- Generate in GitHub Developer Settings
- Can only be viewed once (save it immediately)
- Rotate if exposed

---

## Common Security Mistakes

### 1. Committing .env to Git

**If this happens:**
```bash
# Remove from git (but file stays locally)
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from tracking"

# Push
git push origin master

# IMPORTANT: Rotate ALL secrets in that .env file
```

**Then:**
- Change `AUTH_SECRET` (generate new random string)
- Revoke and regenerate all API keys
- Update production environment variables
- Consider the secrets compromised

### 2. Using Placeholder Values in Production

**Symptoms:**
- "Invalid API key" errors in production
- NextAuth throws "AUTH_SECRET is not set" error
- Stripe checkout fails
- Emails not sending

**Solution:**
- Verify all `.env.example` placeholders are replaced
- Check Vercel environment variables dashboard
- Test each integration in production

### 3. Sharing Secrets in Screenshots

**Never share screenshots of:**
- `.env` file
- Vercel environment variables page
- Stripe dashboard (API keys visible)
- Database connection strings
- OAuth client secrets

**If accidentally shared:**
- Assume secret is compromised
- Rotate immediately
- Check access logs for unauthorized use

---

## Security Checklist (Pre-Deployment)

Run this checklist before every production deployment:

- [ ] `.env` is in `.gitignore` (verify: `git ls-files .env` returns nothing)
- [ ] No secrets in git history (check: `git log --all -- .env`)
- [ ] `AUTH_SECRET` is random 32+ chars (verify length: `echo $AUTH_SECRET | wc -c`)
- [ ] All OAuth redirect URLs updated for production domain
- [ ] Stripe keys are `sk_live_` not `sk_test_`
- [ ] Database connection uses SSL (`sslmode=require`)
- [ ] All API keys are production keys (not test/placeholder)
- [ ] `NEXT_PUBLIC_APP_URL` matches production domain (no localhost)
- [ ] Email domain is verified in Resend
- [ ] Webhook endpoints registered with production URLs

---

## Incident Response

**If secrets are exposed:**

1. **Immediate:**
   - Revoke/regenerate the exposed secret
   - Update production environment variables
   - Deploy with new secret

2. **Within 1 hour:**
   - Check access logs for unauthorized use
   - Review recent database/API activity
   - Notify affected services (Stripe, Google, etc.)

3. **Within 24 hours:**
   - Audit all other secrets (assume breach)
   - Rotate all secrets as precaution
   - Document incident for future reference

---

## Resources

- [NextAuth.js Security](https://next-auth.js.org/configuration/options#secret)
- [OWASP Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**TL;DR:**
- ✅ Use `.env.example` with clearly invalid placeholders
- ✅ Never commit `.env` to git
- ✅ Generate `AUTH_SECRET` with `npx auth secret`
- ✅ Use production keys in production (not test keys)
- ❌ Never use placeholders in production
- ❌ Never share secrets in screenshots/Slack
- ❌ Never use weak secrets like "development-secret-change-in-production"

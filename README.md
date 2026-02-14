# LaunchFast

### Ship your SaaS in days, not months.

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)

Stop wasting weeks wiring up authentication, payments, and email. LaunchFast gives you a production-ready Next.js SaaS boilerplate so you can focus on what matters -- building your product.

---

## What's Included

- **Next.js 15 App Router with TypeScript** -- Server components, route groups, and the latest React 19 features out of the box
- **Authentication (NextAuth.js v5)** -- Google and GitHub OAuth pre-configured with Prisma adapter, session callbacks, and protected routes
- **Stripe Payments** -- Subscription checkout, billing portal, webhook handling, and a pricing page with Free / Pro / Enterprise tiers
- **AI Integration (Anthropic Claude API)** -- Ready-to-use API route for Claude, with auth-gated access and streaming-ready architecture
- **Database (Prisma ORM + PostgreSQL)** -- User, Account, Session, and VerificationToken models with Stripe fields baked in
- **Transactional Email (Resend)** -- Welcome emails and a reusable `sendEmail` utility, ready to extend
- **Landing Page** -- Hero section, pricing cards, header, and footer components -- everything you need to start converting visitors
- **Dashboard** -- Auth-protected dashboard with session-aware content
- **Middleware-Protected Routes** -- `/dashboard` and all sub-routes locked behind NextAuth middleware
- **Tailwind CSS v4** -- Utility-first styling with PostCSS, zero config required
- **Vercel-Ready Deployment** -- Works with `vercel deploy` out of the box, no extra configuration

---

## Quick Start

**1. Clone the repository**

```bash
git clone https://github.com/your-username/launchfast-starter.git
cd launchfast-starter
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up your environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your API keys (see [Configuration Guide](#configuration-guide) below).

**4. Set up the database**

```bash
npx prisma db push
```

**5. Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're live.

---

## Project Structure

```
launchfast-starter/
├── prisma/
│   └── schema.prisma          # Database models (User, Account, Session)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Signup page
│   │   ├── api/
│   │   │   ├── ai/            # Claude AI endpoint
│   │   │   ├── auth/          # NextAuth.js route handler
│   │   │   └── stripe/
│   │   │       ├── checkout/  # Create Stripe checkout sessions
│   │   │       ├── portal/    # Stripe billing portal
│   │   │       └── webhook/   # Stripe webhook handler
│   │   ├── dashboard/         # Protected dashboard page
│   │   ├── pricing/           # Pricing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── dashboard/         # Dashboard UI components
│   │   ├── landing/           # Hero, Pricing, Header, Footer
│   │   └── ui/                # Reusable UI primitives (Button, etc.)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth.js config (Google + GitHub)
│   │   ├── email.ts           # Resend email utilities
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── stripe.ts          # Stripe client, plans, checkout/portal helpers
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Route protection middleware
├── .env.example               # Environment variable template
├── next.config.ts             # Next.js configuration
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Configuration Guide

Copy `.env.example` to `.env` and configure each service:

### Authentication (NextAuth.js v5)

| Variable | Where to get it |
|---|---|
| `AUTH_SECRET` | Run `npx auth secret` or generate any random 32-char string |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) -- create an OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Same as above |
| `GITHUB_CLIENT_ID` | [GitHub Developer Settings](https://github.com/settings/developers) -- create a new OAuth App |
| `GITHUB_CLIENT_SECRET` | Same as above |

Set your OAuth callback URLs to:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Database (Prisma + PostgreSQL)

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string. Use [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app), or a local PostgreSQL instance |

After setting `DATABASE_URL`, run:

```bash
npx prisma db push
```

### Stripe Payments

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) -- use the Secret key |
| `STRIPE_WEBHOOK_SECRET` | [Stripe Webhooks](https://dashboard.stripe.com/webhooks) -- create an endpoint for `/api/stripe/webhook` |
| `STRIPE_PRO_PRICE_ID` | [Stripe Products](https://dashboard.stripe.com/products) -- create a recurring price and copy the `price_` ID |
| `STRIPE_ENTERPRISE_PRICE_ID` | Same as above, for your Enterprise tier |

For local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Anthropic (AI)

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com/settings/keys) |

### Email (Resend)

| Variable | Where to get it |
|---|---|
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) |
| `EMAIL_FROM` | Your verified sender domain in Resend (e.g., `noreply@yourdomain.com`) |

---

## Deployment

### Deploy to Vercel

The fastest way to go live:

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Add all environment variables from your `.env` file
4. Deploy

That's it. Vercel auto-detects Next.js and handles the build.

> **Important:** Update `NEXT_PUBLIC_APP_URL` to your production URL and update your OAuth callback URLs in Google/GitHub to point to your production domain.

---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 | App Router, React Server Components |
| Language | TypeScript 5 | End-to-end type safety |
| Styling | Tailwind CSS v4 | Utility-first CSS framework |
| Authentication | NextAuth.js v5 | OAuth (Google, GitHub) with session management |
| Database | PostgreSQL + Prisma 7 | Type-safe ORM with migrations |
| Payments | Stripe | Subscriptions, checkout, billing portal |
| AI | Anthropic Claude API | Conversational AI integration |
| Email | Resend | Transactional emails |
| UI Icons | Lucide React | Consistent icon set |
| Notifications | React Hot Toast | Toast notifications |
| Deployment | Vercel | Zero-config hosting |

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## License

MIT License. Use it for unlimited personal and commercial projects.

---

**Built for developers who'd rather ship than set up infrastructure.**

[Get LaunchFast](https://gumroad.com) | [Documentation](https://docs.launchfast.dev) | [Twitter](https://twitter.com/launchfast)

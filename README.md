# LaunchFast

### The only Next.js SaaS starter with production-ready AI chat built-in.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![NextAuth](https://img.shields.io/badge/NextAuth-v5-9333EA?style=for-the-badge)

Free alternatives like next-forge give you auth + payments + database. **LaunchFast gives you that PLUS a production-ready Claude AI integration** with streaming, rate limiting, and user-scoped access controls — the foundation every AI-powered SaaS needs.

## Why LaunchFast?

**The AI difference.** While other boilerplates stop at authentication and payments, LaunchFast is the only one that ships with:

- **Production-ready AI chat interface** at `/dashboard/ai-chat` with full conversation history
- **Streaming responses** with Server-Sent Events (SSE) - see messages as they're generated
- **Conversation persistence** - All chats saved to PostgreSQL with full message history
- **6 AI personas** - Pre-built system prompts (Code Expert, Creative Writer, Business Advisor, etc.)
- **Tier-based rate limiting** - 50 messages/day free, 1000/day for paid subscribers
- **Token usage tracking** - Display tokens used per message and total usage
- **Per-user rate limiting** (10 req/min dev, Redis-backed in prod)
- **Session-protected endpoints** (NextAuth integration out of the box)

If you're building a SaaS with AI features, you're choosing between:
1. Starting from scratch and spending 2-3 weeks on AI infrastructure
2. Using a generic boilerplate and building all the AI yourself
3. Using LaunchFast and shipping your AI product this weekend

## Who Should Use LaunchFast?

**Use LaunchFast if you're building:**
- AI writing tools, content generators, or productivity apps
- ChatGPT-style interfaces with your own data/context
- AI-powered analytics, insights, or recommendation engines
- Customer support chatbots with company-specific knowledge
- Code generation, debugging, or developer tools with AI
- Any SaaS where AI chat is a core feature (not a "nice to have")

**Use next-forge (free) if you're building:**
- Project management tools, CRMs, or collaboration software
- E-commerce platforms or marketplace applications
- Analytics dashboards without AI features
- Traditional SaaS without machine learning components

**Bottom line:** If AI is central to your product, LaunchFast saves you 2-3 weeks. If AI is optional or absent, use a free alternative.

---

## LaunchFast vs. The Competition

| Feature | LaunchFast | next-forge (free) | ShipFast | Makerkit |
|---------|-----------|-------------------|----------|----------|
| **Price** | $79 one-time | Free | $199 | $249/yr |
| **Auth** | ✅ NextAuth v5 | ✅ Auth.js | ✅ Supabase | ✅ Supabase |
| **Payments** | ✅ Stripe | ✅ Stripe | ✅ Stripe | ✅ Stripe |
| **Database** | ✅ Prisma 6 | ✅ Drizzle | ✅ Supabase | ✅ Supabase |
| **AI Chat Interface** | ✅ Full UI + history | ❌ | ❌ | ❌ |
| **Streaming AI Chat** | ✅ SSE with Claude | ❌ | ❌ | ❌ |
| **Conversation History** | ✅ PostgreSQL storage | ❌ | ❌ | ❌ |
| **AI Personas** | ✅ 6 built-in | ❌ | ❌ | ❌ |
| **Tier-based AI Limits** | ✅ 50/1000 msgs/day | ❌ | ❌ | ❌ |
| **Token Usage Tracking** | ✅ Per message + total | ❌ | ❌ | ❌ |
| **Rate Limiting (AI)** | ✅ Per-user, Redis-backed | ❌ | ❌ | ❌ |
| **Open Source** | ✅ Full source on GitHub | ✅ | ❌ | ❌ |

**Bottom line:** If you're building a generic SaaS without AI, use next-forge (it's free). If you're building an AI-powered product, LaunchFast saves you 2-3 weeks of AI infrastructure work for $79.

## The AI Chat Feature

LaunchFast includes a **production-ready AI chat system** at `/dashboard/ai-chat` that would take you 2-3 weeks to build from scratch:

### What You Get

1. **Full Chat Interface** - Modern UI with conversation list, message history, and real-time streaming
2. **Conversation Persistence** - All chats saved to PostgreSQL with automatic title generation
3. **Streaming Responses** - Server-Sent Events (SSE) for real-time message streaming like ChatGPT
4. **6 AI Personas** - Pre-built system prompts:
   - General Assistant (helpful and versatile)
   - Code Expert (programming help)
   - Creative Writer (stories and content)
   - Business Advisor (strategy and analysis)
   - Patient Teacher (learning concepts)
   - Research Assistant (deep analysis)
5. **Tier-Based Limiting** - Free users: 50 messages/day, Paid users: 1,000 messages/day
6. **Token Tracking** - Display tokens used per message and total usage for cost monitoring
7. **Usage Dashboard** - Visual progress bars and upgrade prompts
8. **Database Schema** - Conversation and Message models with proper indexes and cascade deletes

### How It Works

- Navigate to `/dashboard/ai-chat` (requires login)
- Start a new chat or resume a previous conversation
- Select an AI persona or use the default assistant
- Send messages and see responses stream in real-time
- All conversations auto-save with searchable history
- Delete conversations with one click
- Track your daily usage and token consumption

See [AI_CHAT_FEATURE.md](./AI_CHAT_FEATURE.md) for complete technical documentation.

## Pricing

**Standard: $79 — One-time purchase. Not a subscription.**

[**Buy Standard**](https://buy.stripe.com/dRm14mfXngO6a7qbZM08g00)

**Pro: $119 — One-time purchase. Not a subscription.**

[**Buy Pro**](https://buy.stripe.com/5kQ4gy26x8hAa7q4xk08g01)

What you get:
- Complete Next.js 16 source code with TypeScript
- **Production-ready Claude AI integration** (streaming, rate limiting, input validation)
- **Comprehensive E2E test suite** (80+ Playwright tests - landing, auth, dashboard, pricing, responsive, SEO)
- NextAuth v5 (Google + GitHub OAuth)
- Stripe integration (checkout, portal, webhooks)
- Prisma 6 + PostgreSQL setup
- Email via Resend
- All landing pages, dashboard with AI chat UI, legal pages
- Full documentation and setup guide
- Lifetime updates

**Save $119:** Get this + 6 other products in the [Complete Bundle for $99](https://buy.stripe.com/5kQeVceTj0P8enGe7U08g06)

---

## What Free Alternatives DON'T Give You

Projects like **next-forge** are excellent for generic SaaS products. They give you auth, payments, and database setup for free. But if you're building an AI-powered product, you'll still need to:

1. **Integrate the AI SDK** (Anthropic, OpenAI, etc.) — 2-3 days
2. **Add streaming support** for real-time responses — 1-2 days
3. **Implement rate limiting** per user to prevent API abuse — 2-3 days
4. **Build input validation** to avoid expensive malicious requests — 1 day
5. **Create a chat UI** with loading states and error handling — 2-3 days
6. **Wire up session auth** to the AI endpoint — 1 day
7. **Add systemPrompt support** for multi-persona systems — 1 day
8. **Set up token tracking** for usage-based billing — 2-3 days

**Total time: 2-3 weeks of work.**

**LaunchFast gives you all of this out of the box.** If you're building a non-AI SaaS, use next-forge. If you're building anything with AI features, LaunchFast saves you weeks.

---

## Screenshots

### AI Chat Dashboard
![LaunchFast AI Chat](https://via.placeholder.com/800x500/000000/FFFFFF/?text=Production-Ready+AI+Chat+Dashboard)

The dashboard includes a pre-built AI chat interface with:
- Real-time streaming responses
- Loading states and error handling
- Session-protected access
- Rate limiting built-in

### Stripe Integration
![Stripe Billing Portal](https://via.placeholder.com/800x500/000000/FFFFFF/?text=Stripe+Checkout+%26+Billing+Portal)

Fully configured Stripe checkout and billing portal with webhook handling.

---

## The Code

### Authentication (30 lines, fully configured)

Google + GitHub OAuth with Prisma persistence. This is the entire auth config:

```typescript
// src/lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
```

Route protection? Two lines in middleware:

```typescript
// src/middleware.ts
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### Stripe Webhooks (production-ready)

Handles checkout completion, subscription renewals, and cancellations. Signature verification, Prisma updates, all the edge cases:

```typescript
// src/app/api/stripe/webhook/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const sub = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const subscription = sub as unknown as Stripe.Subscription;

      await prisma.user.update({
        where: { id: session.metadata!.userId },
        data: {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            (subscription as unknown as Record<string, unknown>)
              .current_period_end as number * 1000
          ),
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as unknown as Record<string, unknown>;
      if (!invoice.subscription) break;

      const sub = await stripe.subscriptions.retrieve(
        invoice.subscription as string
      );
      const subscription = sub as unknown as Stripe.Subscription;

      await prisma.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            (subscription as unknown as Record<string, unknown>)
              .current_period_end as number * 1000
          ),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

### Stripe Checkout + Billing Portal

Clean helpers for creating checkout sessions and managing billing:

```typescript
// src/lib/stripe.ts (checkout helpers)
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  email: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    customer_email: email,
    metadata: { userId },
  });

  return session;
}

export async function createBillingPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}
```

### AI Integration (Claude API, production-ready)

**This is what makes LaunchFast different.** A complete AI chat system that would take you 2-3 weeks to build yourself:

```typescript
// src/app/api/ai/route.ts
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting (see src/lib/ratelimit.ts for full implementation)

  const { prompt, systemPrompt } = await req.json();

  // Input validation - prevents expensive API abuse
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Valid prompt required" }, { status: 400 });
  }

  if (prompt.length > 4000) {
    return NextResponse.json(
      { error: "Prompt exceeds maximum length of 4000 characters" },
      { status: 400 }
    );
  }

  if (systemPrompt !== undefined && typeof systemPrompt !== "string") {
    return NextResponse.json(
      { error: "System prompt must be a string" },
      { status: 400 }
    );
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    system: systemPrompt || "You are a helpful assistant.",
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  const text = content.type === "text" ? content.text : "";

  return NextResponse.json({ response: text });
}
```

**What you get that free boilerplates don't have:**
- ✅ **Session-based auth** — Only logged-in users can access AI
- ✅ **Per-user rate limiting** — 10 req/min in dev, Upstash Redis in production
- ✅ **Input validation** — 4000 char prompt limit, systemPrompt sanitization
- ✅ **Type safety** — Full TypeScript, prevents malformed API calls
- ✅ **Multi-persona support** — systemPrompt parameter ready for different AI modes
- ✅ **Dashboard UI** — Pre-built chat interface with loading states
- ✅ **Token tracking foundation** — Easy to extend for usage-based billing

**Time to implement this yourself:** 2-3 weeks (auth integration, rate limiting, error handling, UI)
**Time with LaunchFast:** 5 minutes (add your API key, deploy)

### Transactional Email (Resend)

Welcome emails out of the box, plus a generic `sendEmail` for anything else:

```typescript
// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: `${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Welcome to ${process.env.APP_NAME}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome, ${name}!</h1>
        <p>Thanks for signing up. You're all set to start using ${process.env.APP_NAME}.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display: inline-block; padding: 12px 24px; background: #000;
                  color: #fff; text-decoration: none; border-radius: 6px;">
          Go to Dashboard
        </a>
      </div>
    `,
  });
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: `${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}
```

---

## Quick Start

```bash
git clone https://github.com/Wittlesus/launchfast-starter.git
cd launchfast-starter
npm install
cp .env.example .env    # fill in your API keys
npx prisma db push
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

### Monitoring (Optional)

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | [Sentry Dashboard](https://sentry.io) - Create Next.js project |
| `SENTRY_AUTH_TOKEN` | Sentry Settings → Auth Tokens (for uploading source maps) |

**Logging** is built-in and works out of the box - see `src/lib/logger.ts`
**Error tracking** with Sentry is optional - see [MONITORING.md](./MONITORING.md) for setup guide

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth.js v5 |
| Database | PostgreSQL + Prisma |
| Payments | Stripe |
| AI | Anthropic Claude API |
| Email | Resend |
| Logging | Built-in structured logger |
| Monitoring | Optional Sentry integration |
| Deployment | Vercel |

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## More Developer Tools

| Product | Description | Price |
|---------|-------------|-------|
| [PageBrain Extension](https://github.com/Wittlesus/pagebrain-extension) | Summarize any page with AI (Chrome) | Free |
| [SEO Blog Engine](https://github.com/Wittlesus/seo-blog-engine) | CLI for generating SEO blog posts | $29 |
| [Indie Hacker Toolkit](https://github.com/Wittlesus/indie-hacker-toolkit) | 5 planning templates for solo founders | $19 |
| [PromptVault](https://github.com/Wittlesus/prompt-vault) | 64 production-ready AI prompts | $19 |
| [CursorRules Pro](https://github.com/Wittlesus/cursorrules-pro) | .cursorrules for 8 popular stacks | $14 |
| [Complete Bundle](https://buy.stripe.com/5kQeVceTj0P8enGe7U08g06) | All products above | $99 |

---

## License

MIT License. Use it for unlimited personal and commercial projects.

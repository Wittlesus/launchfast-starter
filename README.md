# LaunchFast

### Ship your SaaS in days, not months.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![NextAuth](https://img.shields.io/badge/NextAuth-v5-9333EA?style=for-the-badge)

A production-ready Next.js SaaS boilerplate. Auth, payments, AI, email -- all wired up. Here's what the actual code looks like.

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

### AI Integration (Claude API, auth-gated)

One API route. Session-protected, rate-limited, and input-validated. Drop in your Anthropic key and it works:

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

**Security features:**
- Authentication required (NextAuth)
- Rate limiting (10 requests/minute in dev, configurable via Upstash Redis in production)
- Input validation (prompt max 4000 chars, systemPrompt max 2000 chars)
- Type checking to prevent malicious payloads

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

import Stripe from "stripe";

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Please add it to your .env file."
    );
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

let _stripe: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    if (!_stripe) _stripe = getStripeClient();
    return (_stripe as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = [
  {
    name: "Starter",
    description: "For solo developers",
    price: 79,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "",
    features: [
      "Full Next.js 16 SaaS boilerplate",
      "NextAuth v5 with Google & GitHub OAuth",
      "Stripe subscriptions, checkout, webhooks",
      "Prisma 6 + PostgreSQL schema",
      "Claude AI integration (auth-gated)",
      "Landing page, pricing page, dashboard",
      "Middleware route protection",
      "1 project license",
      "Community support via GitHub",
    ],
  },
  {
    name: "Pro",
    description: "For professionals & agencies",
    price: 119,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    features: [
      "Everything in Starter",
      "Unlimited project license",
      "Priority email support",
      "Early access to updates",
      "Pro .cursorrules configs included",
    ],
    popular: true,
  },
] as const;

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  email: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment", // One-time payment for boilerplate access
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

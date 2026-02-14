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
    priceId: "",
    features: [
      "Up to 100 requests/month",
      "Basic support",
      "Community access",
    ],
  },
  {
    name: "Pro",
    description: "For professionals",
    price: 119,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      "Unlimited requests",
      "Priority support",
      "API access",
      "Advanced analytics",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams",
    price: 299,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Team management",
    ],
  },
] as const;

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

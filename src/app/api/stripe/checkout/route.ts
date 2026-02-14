import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession, PLANS } from "@/lib/stripe";

// Build a set of valid (non-empty) price IDs from the PLANS config
const VALID_PRICE_IDS = new Set(
  PLANS.map((p) => p.priceId).filter(Boolean)
);

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await req.json();

  if (!priceId) {
    return NextResponse.json({ error: "Price ID required" }, { status: 400 });
  }

  // Validate priceId against the known PLANS whitelist
  if (!VALID_PRICE_IDS.has(priceId)) {
    return NextResponse.json(
      { error: "Invalid price ID" },
      { status: 400 }
    );
  }

  const checkoutSession = await createCheckoutSession(
    session.user.id,
    priceId,
    session.user.email
  );

  return NextResponse.json({ url: checkoutSession.url });
}

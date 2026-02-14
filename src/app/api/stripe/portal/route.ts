import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBillingPortalSession } from "@/lib/stripe";
import {
  portalRateLimiter,
  getRateLimitKey,
  inMemoryRateLimit,
} from "@/lib/ratelimit";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting: 3 portal requests per 60 seconds
  const rateLimitKey = getRateLimitKey(req, session.user.id);

  if (portalRateLimiter) {
    const { success } = await portalRateLimiter.limit(rateLimitKey);
    if (!success) {
      return NextResponse.json(
        { error: "Too many portal requests. Please try again later." },
        { status: 429 }
      );
    }
  } else {
    const result = inMemoryRateLimit(rateLimitKey, 3);
    if (!result.success) {
      return NextResponse.json(
        { error: "Too many portal requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account" }, { status: 400 });
  }

  const portalSession = await createBillingPortalSession(
    user.stripeCustomerId
  );

  return NextResponse.json({ url: portalSession.url });
}

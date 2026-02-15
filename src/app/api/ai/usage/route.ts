import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const FREE_TIER_LIMIT = 50;
const PAID_TIER_LIMIT = 1000;

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        aiMessagesToday: true,
        aiMessagesResetAt: true,
        totalTokensUsed: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reset daily counter if needed
    const now = new Date();
    const resetAt = new Date(user.aiMessagesResetAt);
    const shouldReset = now.getTime() - resetAt.getTime() > 24 * 60 * 60 * 1000;

    let messagesUsedToday = user.aiMessagesToday;
    if (shouldReset) {
      messagesUsedToday = 0;
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          aiMessagesToday: 0,
          aiMessagesResetAt: now,
        },
      });
    }

    // Determine if user has paid subscription
    const hasPaidSubscription =
      user.stripePriceId &&
      user.stripeCurrentPeriodEnd &&
      new Date(user.stripeCurrentPeriodEnd) > now;

    const dailyLimit = hasPaidSubscription ? PAID_TIER_LIMIT : FREE_TIER_LIMIT;

    return NextResponse.json({
      messagesUsedToday,
      dailyLimit,
      totalTokensUsed: user.totalTokensUsed,
      hasPaidSubscription,
      resetAt: shouldReset ? now : resetAt,
    });
  } catch (error) {
    console.error("Failed to fetch usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import {
  webhookRateLimiter,
  getRateLimitKey,
  inMemoryRateLimit,
} from "@/lib/ratelimit";

// In-memory cache for idempotency (production should use Redis or DB)
const processedEvents = new Map<string, number>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [eventId, timestamp] of processedEvents.entries()) {
    if (now - timestamp > CACHE_TTL_MS) {
      processedEvents.delete(eventId);
    }
  }
}, 60 * 60 * 1000); // Clean every hour

export async function POST(req: Request) {
  // Rate limiting: 100 webhook requests per 60 seconds per IP
  const rateLimitKey = getRateLimitKey(req);

  if (webhookRateLimiter) {
    const { success } = await (webhookRateLimiter as { limit: (key: string) => Promise<{ success: boolean }> }).limit(rateLimitKey);
    if (!success) {
      return NextResponse.json(
        { error: "Webhook rate limit exceeded" },
        { status: 429 }
      );
    }
  } else {
    const result = inMemoryRateLimit(rateLimitKey, 100);
    if (!result.success) {
      return NextResponse.json(
        { error: "Webhook rate limit exceeded" },
        { status: 429 }
      );
    }
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    console.error("Webhook error: Missing Stripe-Signature header");
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Webhook error: STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(
      "Webhook signature verification failed:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency check - prevent duplicate processing
  if (processedEvents.has(event.id)) {
    console.log(`Event ${event.id} already processed, skipping`);
    return NextResponse.json({ received: true, cached: true });
  }

  // Process webhook events with proper error handling
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Validate required metadata
        const userId = session.metadata?.userId;
        if (!userId) {
          console.error(
            "Webhook error: Missing userId in checkout session metadata"
          );
          return NextResponse.json(
            { error: "Missing user metadata" },
            { status: 400 }
          );
        }

        // For one-time payments only (this boilerplate doesn't use subscriptions)
        if (session.mode === "payment") {
          try {
            // Extract customer ID safely - Stripe can return string or object
            const customerId = typeof session.customer === "string"
              ? session.customer
              : session.customer?.id;

            if (!customerId) {
              console.error(
                "Webhook error: Missing customer ID in checkout session"
              );
              return NextResponse.json(
                { error: "Missing customer data" },
                { status: 400 }
              );
            }

            // Use Prisma transaction for atomic operation
            await prisma.$transaction(async (tx: typeof prisma) => {
              // Update user with customer ID
              await tx.user.update({
                where: { id: userId },
                data: {
                  stripeCustomerId: customerId,
                  // For one-time payment, user gets lifetime access
                  // Payment details are stored in Stripe, not our DB
                },
              });
            });

            // Mark event as processed AFTER successful completion
            processedEvents.set(event.id, Date.now());
            console.log(`One-time payment completed for user: ${userId}`);
          } catch (dbError) {
            console.error(
              "Database error in checkout.session.completed:",
              dbError
            );
            // Return 500 so Stripe retries this webhook
            return NextResponse.json(
              { error: "Database error" },
              { status: 500 }
            );
          }
        }
        break;
      }

      default:
        // Unknown event type - log but don't fail
        console.log(`Unhandled event type: ${event.type}`);
        // Still mark as processed to avoid repeated logging
        processedEvents.set(event.id, Date.now());
    }
  } catch (error) {
    // Catch-all for any unexpected errors
    console.error(
      "Unexpected error processing webhook:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

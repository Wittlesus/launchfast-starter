import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
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

        // For one-time payments (mode: 'payment'), not subscriptions
        if (session.mode === "payment") {
          try {
            await prisma.user.update({
              where: { id: userId },
              data: {
                stripeCustomerId: session.customer as string,
                // For one-time payment, grant lifetime access
                // Payment intent ID is stored in Stripe, not needed in our DB
              },
            });
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
        // For subscription payments (if we ever add them back)
        else if (session.mode === "subscription" && session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );

            await prisma.user.update({
              where: { id: userId },
              data: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
              },
            });
            console.log(`Subscription created for user: ${userId}`);
          } catch (error) {
            console.error(
              "Error processing subscription checkout:",
              error instanceof Error ? error.message : "Unknown error"
            );
            return NextResponse.json(
              { error: "Subscription processing failed" },
              { status: 500 }
            );
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) break;

        try {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );

          await prisma.user.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          });
          console.log(
            `Subscription renewed: ${subscription.id}`
          );
        } catch (error) {
          console.error(
            "Error processing invoice payment:",
            error instanceof Error ? error.message : "Unknown error"
          );
          return NextResponse.json(
            { error: "Invoice processing failed" },
            { status: 500 }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        try {
          await prisma.user.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          });
          console.log(
            `Subscription cancelled: ${subscription.id}`
          );
        } catch (error) {
          console.error(
            "Error processing subscription deletion:",
            error instanceof Error ? error.message : "Unknown error"
          );
          return NextResponse.json(
            { error: "Subscription deletion failed" },
            { status: 500 }
          );
        }
        break;
      }

      default:
        // Unknown event type - log but don't fail
        console.log(`Unhandled event type: ${event.type}`);
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

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import {
  aiRateLimiter,
  getRateLimitKey,
  inMemoryRateLimit,
} from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Message limits per day based on subscription
const FREE_TIER_LIMIT = 50;
const PAID_TIER_LIMIT = 1000; // Effectively unlimited for most use cases

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting with Upstash Redis (production) or in-memory fallback (dev)
  const rateLimitKey = getRateLimitKey(req, session.user.id);

  if (aiRateLimiter) {
    const { success, limit, remaining, reset } =
      await aiRateLimiter.limit(rateLimitKey);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          limit,
          remaining,
          reset: new Date(reset).toISOString(),
        },
        { status: 429 }
      );
    }
  } else {
    const result = inMemoryRateLimit(rateLimitKey, 10);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          limit: result.limit,
          remaining: result.remaining,
        },
        { status: 429 }
      );
    }
  }

  const { conversationId, message, systemPrompt } = await req.json();

  // Input validation
  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  if (message.length > 4000) {
    return NextResponse.json(
      { error: "Message exceeds maximum length of 4000 characters" },
      { status: 400 }
    );
  }

  try {
    // Get or create user with usage tracking
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        aiMessagesToday: true,
        aiMessagesResetAt: true,
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

    // Check daily message limit
    if (messagesUsedToday >= dailyLimit) {
      return NextResponse.json(
        {
          error: `Daily message limit reached (${dailyLimit} messages). ${
            hasPaidSubscription
              ? "Limit resets in 24 hours."
              : "Upgrade to Pro for higher limits."
          }`,
          limit: dailyLimit,
          used: messagesUsedToday,
        },
        { status: 429 }
      );
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId: session.user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 20, // Last 20 messages for context
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
    } else {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
          messages: {
            create: {
              role: "user",
              content: message,
              systemPrompt: systemPrompt || null,
            },
          },
        },
        include: {
          messages: true,
        },
      });
    }

    // If conversation exists, add user message
    if (conversationId) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: message,
          systemPrompt: systemPrompt || null,
        },
      });
    }

    // Build conversation history for Claude
    const conversationHistory = conversation.messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Add current message if not already added
    if (!conversationHistory.find((m) => m.content === message)) {
      conversationHistory.push({
        role: "user" as const,
        content: message,
      });
    }

    // Stream response from Claude
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      system:
        systemPrompt ||
        "You are a helpful AI assistant integrated into a SaaS application. Provide clear, concise, and accurate responses.",
      messages: conversationHistory,
    });

    // Track the full response for saving
    let fullResponse = "";
    let inputTokens = 0;
    let outputTokens = 0;

    // Create a ReadableStream for the response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta") {
              const text =
                chunk.delta.type === "text_delta" ? chunk.delta.text : "";
              fullResponse += text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            } else if (chunk.type === "message_start") {
              inputTokens = chunk.message.usage.input_tokens;
            } else if (chunk.type === "message_delta") {
              outputTokens = chunk.usage.output_tokens;
            }
          }

          // Save assistant message to database
          const totalTokens = inputTokens + outputTokens;
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              role: "assistant",
              content: fullResponse,
              tokensUsed: totalTokens,
            },
          });

          // Update user's token usage and message count
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              totalTokensUsed: { increment: totalTokens },
              aiMessagesToday: { increment: 1 },
            },
          });

          // Send final metadata
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                conversationId: conversation.id,
                tokens: { input: inputTokens, output: outputTokens, total: totalTokens },
                usage: {
                  messagesUsedToday: messagesUsedToday + 1,
                  dailyLimit,
                },
              })}\n\n`
            )
          );

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

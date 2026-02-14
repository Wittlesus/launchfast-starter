import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import {
  aiRateLimiter,
  getRateLimitKey,
  inMemoryRateLimit,
} from "@/lib/ratelimit";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting with Upstash Redis (production) or in-memory fallback (dev)
  const rateLimitKey = getRateLimitKey(req, session.user.id);

  if (aiRateLimiter) {
    // Production: distributed rate limiting with Upstash Redis
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
    // Development fallback: in-memory rate limiting
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

  const { prompt, systemPrompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt required" }, { status: 400 });
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

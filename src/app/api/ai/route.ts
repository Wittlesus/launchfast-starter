import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// --- In-memory rate limiting (10 requests / 60 s per user) ---
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) ?? [];

  // Keep only timestamps within the current window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(key, recent);

  if (recent.length >= RATE_LIMIT_MAX) {
    return true;
  }

  recent.push(now);
  return false;
}

// Periodically clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitMap) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, recent);
    }
  }
}, 5 * 60_000);

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit by user ID, falling back to IP address
  const rateLimitKey =
    session.user.id ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (isRateLimited(rateLimitKey)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
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

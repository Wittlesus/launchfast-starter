# Quick Start: AI Chat Feature

Get your AI chat system running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Anthropic API key ([get one here](https://console.anthropic.com/settings/keys))

## Step 1: Install Dependencies

```bash
npm install
```

Already done during initial setup. The `@anthropic-ai/sdk` package is included.

## Step 2: Configure Environment

Add to your `.env` file:

```bash
# Required: Anthropic API key
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Required: Database (for conversation storage)
DATABASE_URL=postgresql://user:password@localhost:5432/launchfast

# Optional: Redis for distributed rate limiting (production)
UPSTASH_REDIS_REST_URL=https://your-project.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

**Where to get these:**

- **ANTHROPIC_API_KEY**: Sign up at [console.anthropic.com](https://console.anthropic.com), go to Settings → API Keys
- **DATABASE_URL**: Use [Neon](https://neon.tech) (free tier), [Supabase](https://supabase.com), or local PostgreSQL
- **Upstash Redis** (optional): Sign up at [upstash.com](https://upstash.com) for free tier (10K requests/day)

## Step 3: Run Database Migration

```bash
npx prisma migrate dev
```

This creates the tables:
- `Conversation` - Stores chat conversations
- `Message` - Stores individual messages
- Updates `User` with AI usage tracking fields

If you get an error about existing migrations, run:
```bash
npx prisma db push
```

## Step 4: Start Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## Step 5: Test AI Chat

1. **Sign up/login** at `http://localhost:3000/login`
2. **Navigate to AI Chat**: Click "AI Chat" in the sidebar or go to `/dashboard/ai-chat`
3. **Send a message**: Type anything and hit Enter
4. **Watch the magic**: Response streams in real-time!

## Troubleshooting

### "Unauthorized" error
- Make sure you're logged in (visit `/login`)
- Check that NextAuth is configured (see main README)

### "Too many requests"
- Default limit: 10 requests per minute in dev mode
- Wait 60 seconds or increase limit in `src/lib/ratelimit.ts`

### "Failed to process request"
- Check your `ANTHROPIC_API_KEY` is valid
- Verify `DATABASE_URL` is set correctly
- Check terminal logs for detailed error

### No streaming (response appears all at once)
- Your browser might not support Server-Sent Events
- Try a modern browser (Chrome, Firefox, Safari, Edge)

### Database errors
- Run `npx prisma generate` to regenerate Prisma client
- Run `npx prisma db push` to sync schema

## Feature Overview

### Free Tier (Default)
- **50 messages/day** per user
- Resets automatically every 24 hours
- Visual progress bar shows usage
- Upgrade prompt when approaching limit

### Paid Tier (Stripe Subscription)
To enable paid tier for a user:

1. User purchases subscription via Stripe checkout
2. Webhook updates user's `stripePriceId` and `stripeCurrentPeriodEnd`
3. AI chat automatically switches to 1,000 messages/day limit

Or manually set in database:
```sql
UPDATE "User"
SET
  "stripePriceId" = 'price_123',
  "stripeCurrentPeriodEnd" = NOW() + INTERVAL '30 days'
WHERE email = 'test@example.com';
```

### AI Personas

Six built-in options:

1. **General Assistant** - Default, helpful and versatile
2. **Code Expert** - Best for programming questions
3. **Creative Writer** - Stories, content, brainstorming
4. **Business Advisor** - Strategy and analysis
5. **Patient Teacher** - Learning new concepts
6. **Research Assistant** - Deep research and analysis

Select from dropdown before starting a conversation.

### Token Tracking

Each message shows:
- Input tokens (your message)
- Output tokens (AI response)
- Total tokens used

User's total token consumption tracked in `User.totalTokensUsed`.

### Conversation Management

- **Create**: Send first message → new conversation auto-created
- **List**: Sidebar shows all conversations, newest first
- **Resume**: Click any conversation to continue chatting
- **Delete**: Hover and click trash icon (with confirmation)
- **Title**: Auto-generated from first message

## Customization

### Change Message Limits

Edit `src/app/api/ai/chat/route.ts`:

```typescript
const FREE_TIER_LIMIT = 50;   // Change to your desired limit
const PAID_TIER_LIMIT = 1000; // Change to your desired limit
```

### Add New AI Persona

Edit `src/components/ai-chat/SystemPromptSelector.tsx`:

```typescript
const SYSTEM_PROMPTS = [
  // ... existing personas ...
  {
    id: "my-persona",
    name: "My Custom Persona",
    description: "What this persona does",
    prompt: "You are a [description]. [Behavior instructions].",
  },
];
```

### Change AI Model

Edit `src/app/api/ai/chat/route.ts`:

```typescript
const stream = await anthropic.messages.stream({
  model: "claude-sonnet-4-5-20250929", // Change this
  // ... rest of config
});
```

Available models:
- `claude-opus-4-6` - Most powerful, slower, expensive
- `claude-sonnet-4-5-20250929` - Balanced (current default)
- `claude-haiku-4-6` - Fastest, cheapest, less capable

### Modify Max Tokens

Edit `src/app/api/ai/chat/route.ts`:

```typescript
const stream = await anthropic.messages.stream({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 2048, // Change this (range: 1-4096)
  // ...
});
```

Higher = longer responses but more expensive.

## Production Deployment

### Required Changes

1. **Set up Upstash Redis**
   - Sign up at [upstash.com](https://upstash.com)
   - Create a Redis database
   - Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to production env vars

2. **Database**
   - Use a production PostgreSQL database (Neon, Supabase, Railway)
   - Run migrations: `npx prisma migrate deploy`

3. **Environment Variables**
   - Add all env vars from `.env` to your hosting platform (Vercel, Railway, etc.)
   - **Never commit** `.env` to git

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Run migration after first deploy:
vercel env pull
npx prisma migrate deploy
```

### Cost Estimation

**Claude Sonnet 4.5 pricing:**
- Input: $3 per million tokens
- Output: $15 per million tokens

**Example monthly costs:**

**Free tier (50 msgs/day, 100 active users):**
- 50 msgs × 100 users × 30 days = 150,000 messages/month
- Avg 500 tokens per message (250 in, 250 out)
- Cost: 150K × (250 × $0.000003 + 250 × $0.000015) = **$675/month**

**Paid tier (1000 msgs/day, 10 active users):**
- 1000 msgs × 10 users × 30 days = 300,000 messages/month
- Cost: 300K × (250 × $0.000003 + 250 × $0.000015) = **$1,350/month**

**Revenue to aim for:**
- Free tier: $0 (lead generation)
- Paid tier: $29-49/month per user
- Breakeven: ~28-45 paid users

**Tip:** Use Claude Haiku for free tier to reduce costs by 80%.

## Support

- **Documentation**: See [AI_CHAT_FEATURE.md](./AI_CHAT_FEATURE.md)
- **Issues**: [GitHub Issues](https://github.com/Wittlesus/launchfast-starter/issues)
- **Questions**: Email support@yoursite.com

## Next Steps

1. **Customize personas** - Add industry-specific AI assistants
2. **Brand the UI** - Update colors, logos, copy
3. **Add features** - Voice input, image attachments, export to PDF
4. **Set pricing** - Decide on free/paid tier limits
5. **Monitor costs** - Track token usage via Anthropic dashboard
6. **Scale** - Add Redis, CDN, optimize database queries

---

**You're ready to ship!** Your AI chat is production-ready out of the box. Focus on your unique value-add, not infrastructure.

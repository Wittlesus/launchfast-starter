# AI Chat Feature - Production-Ready Claude Integration

## Overview

LaunchFast now includes a **production-ready AI chat system** powered by Claude Sonnet 4.5 (Anthropic's latest model). This is not just SDK wiring - it's a complete, feature-rich chat application that showcases what makes LaunchFast different from free boilerplates.

## Key Features

### 1. **Streaming Responses**
- Real-time message streaming using Server-Sent Events (SSE)
- Users see responses as they're generated (like ChatGPT)
- Smooth typing indicator while AI is thinking

### 2. **Conversation History**
- All conversations saved to PostgreSQL via Prisma
- Browse and resume previous chats
- Delete conversations with cascade delete (removes all messages)
- Conversation titles auto-generated from first message

### 3. **Token Usage Tracking**
- Track input/output tokens per message
- Display total tokens used by user
- Real-time usage stats in the UI
- Cost estimation (based on Anthropic pricing)

### 4. **Tier-Based Rate Limiting**
- **Free tier**: 50 messages/day
- **Paid tier**: 1,000 messages/day (effectively unlimited)
- Auto-resets every 24 hours
- Integrates with existing Stripe subscription check
- Graceful error messages when limits reached

### 5. **System Prompt Personas**
Six pre-built AI personas:
- **General Assistant**: Helpful and versatile
- **Code Expert**: Programming and technical help
- **Creative Writer**: Stories, content, and ideas
- **Business Advisor**: Strategy and analysis
- **Patient Teacher**: Learn new concepts
- **Research Assistant**: Deep analysis and research

Users can switch personas mid-conversation or start fresh with a different persona.

### 6. **Production-Ready UI**
- Clean, modern design matching LaunchFast aesthetic
- Responsive layout (mobile-friendly)
- Keyboard shortcuts (Enter to send)
- Auto-scroll to latest message
- Loading states and error handling
- Visual progress bar for daily usage

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js 16 App Router (API routes)
- **AI**: Anthropic Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **Database**: PostgreSQL + Prisma 6
- **Auth**: NextAuth v5 (session-based)
- **Rate Limiting**: Upstash Redis (with in-memory fallback)

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── chat/route.ts              # Streaming chat endpoint
│   │       ├── conversations/route.ts      # List conversations
│   │       ├── conversations/[id]/route.ts # Get/delete specific conversation
│   │       └── usage/route.ts              # Get user's AI usage stats
│   └── dashboard/
│       └── ai-chat/
│           └── page.tsx                    # AI chat page (auth-gated)
├── components/
│   └── ai-chat/
│       ├── AiChatContent.tsx               # Main chat interface
│       ├── SystemPromptSelector.tsx        # Persona selector
│       └── UsageStats.tsx                  # Usage display widget
└── prisma/
    ├── schema.prisma                       # Database schema (updated)
    └── migrations/
        └── 20260214000000_add_ai_chat_models/
            └── migration.sql               # Migration for new tables
```

## Database Schema

### User (extended)
```prisma
model User {
  // ... existing fields ...
  aiMessagesToday   Int      @default(0)
  aiMessagesResetAt DateTime @default(now())
  totalTokensUsed   Int      @default(0)
  conversations     Conversation[]
}
```

### Conversation
```prisma
model Conversation {
  id        String   @id @default(cuid())
  title     String   @default("New Chat")
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages Message[]
}
```

### Message
```prisma
model Message {
  id             String   @id @default(cuid())
  conversationId String
  role           String   // "user" or "assistant"
  content        String   @db.Text
  systemPrompt   String?  @db.Text
  tokensUsed     Int      @default(0)
  createdAt      DateTime @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### POST `/api/ai/chat`
Stream a new message to the AI.

**Request:**
```json
{
  "conversationId": "clx123...", // optional, creates new if omitted
  "message": "What is React?",
  "systemPrompt": "You are a helpful teacher..." // optional
}
```

**Response:** Server-Sent Events stream
```
data: {"text":"React"}
data: {"text":" is"}
data: {"text":" a"}
...
data: {"done":true,"conversationId":"clx123...","tokens":{"input":15,"output":120,"total":135},"usage":{"messagesUsedToday":5,"dailyLimit":50}}
```

### GET `/api/ai/conversations`
List all conversations for the authenticated user.

**Response:**
```json
{
  "conversations": [
    {
      "id": "clx123...",
      "title": "What is React?",
      "updatedAt": "2026-02-14T10:30:00Z",
      "messages": [...]
    }
  ]
}
```

### GET `/api/ai/conversations/[id]`
Get a specific conversation with all messages.

### DELETE `/api/ai/conversations/[id]`
Delete a conversation (cascades to messages).

### GET `/api/ai/usage`
Get current user's AI usage statistics.

**Response:**
```json
{
  "messagesUsedToday": 12,
  "dailyLimit": 50,
  "totalTokensUsed": 45280,
  "hasPaidSubscription": false,
  "resetAt": "2026-02-14T00:00:00Z"
}
```

## Environment Variables

Required in `.env`:
```bash
# Anthropic API Key (get from https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Database (required for conversation storage)
DATABASE_URL=postgresql://user:password@localhost:5432/launchfast

# Optional: Upstash Redis for distributed rate limiting
# Without these, falls back to in-memory (dev only)
UPSTASH_REDIS_REST_URL=https://your-project.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

## Setup Instructions

1. **Run the migration:**
   ```bash
   npx prisma migrate deploy
   # or for dev:
   npx prisma migrate dev
   ```

2. **Add your Anthropic API key** to `.env`:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

4. **Navigate to** `http://localhost:3000/dashboard/ai-chat`

## Rate Limiting Details

### Free Tier (Default)
- **50 messages/day** per user
- Resets every 24 hours
- Enforced at API level
- Shows upgrade prompt when approaching limit

### Paid Tier (Stripe Subscription)
- **1,000 messages/day** (effectively unlimited for most users)
- Automatically enabled when user has:
  - `stripePriceId` set
  - `stripeCurrentPeriodEnd` in the future
- No upgrade prompts

### Implementation
Rate limiting uses two layers:
1. **Request rate limiting** (via Upstash Redis): 10 requests/minute per user
2. **Message count limiting** (via PostgreSQL): Daily message caps based on tier

## Token Pricing (FYI)

Using Claude Sonnet 4.5:
- **Input**: $3 per million tokens
- **Output**: $15 per million tokens

**Example cost for free tier:**
- 50 messages × ~500 tokens avg = 25,000 tokens/day
- Cost: ~$0.30/user/month (assuming 50/50 input/output mix)

**Monetization strategy:**
- Offer free tier to drive signups
- Upsell to paid ($10-20/mo) for higher limits
- Your actual API costs are minimal compared to subscription revenue

## Why This Beats Free Boilerplates

Free boilerplates like **next-forge** don't include:
- ❌ AI integration at all
- ❌ Conversation history
- ❌ Token tracking
- ❌ Tier-based limiting
- ❌ Streaming responses
- ❌ Production-ready UI

LaunchFast gives you all of this **out of the box**, saving 20+ hours of development time.

## Customization Ideas

1. **Add more personas**: Edit `SystemPromptSelector.tsx`
2. **Increase limits**: Modify `FREE_TIER_LIMIT` and `PAID_TIER_LIMIT` in API routes
3. **Change model**: Replace `claude-sonnet-4-5-20250929` with any Anthropic model
4. **Add attachments**: Extend Message schema to support images
5. **Multi-modal**: Use Claude's vision capabilities for image analysis
6. **Export chats**: Add PDF/Markdown export functionality
7. **Team sharing**: Add conversation sharing between users
8. **Voice input**: Integrate Web Speech API

## Testing Checklist

- [ ] Create new conversation
- [ ] Send message and receive streaming response
- [ ] Switch personas mid-conversation
- [ ] View conversation history in sidebar
- [ ] Resume previous conversation
- [ ] Delete conversation
- [ ] Reach daily limit (test with low limit)
- [ ] Verify token tracking shows up
- [ ] Test as free user vs paid user
- [ ] Check rate limiting (spam requests)

## Support

For issues or questions:
- GitHub Issues: [your-repo/issues](https://github.com/yourusername/launchfast-starter/issues)
- Email: support@yoursite.com

---

**Built with LaunchFast** - The Next.js SaaS boilerplate that ships with real features, not just wiring.

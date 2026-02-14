# Monitoring & Observability Guide

Production SaaS apps need visibility into errors, performance, and user behavior. This guide shows you how to set up logging and error tracking for LaunchFast.

## 🎯 Quick Start

### Built-in Logging (Free, Always Available)

LaunchFast includes a structured logging utility that works out of the box:

```typescript
import { logger } from '@/lib/logger';

// Different log levels
logger.debug('User clicked button', { userId: '123', buttonId: 'submit' });
logger.info('Payment processed', { amount: 99, customerId: 'cus_123' });
logger.warn('Rate limit approaching', { remaining: 5, limit: 100 });
logger.error('Payment failed', new Error('Card declined'), { customerId: 'cus_123' });
```

**Development:** Pretty console logs with emojis
**Production:** Structured JSON logs for log aggregators (Datadog, CloudWatch, Logtail, etc.)

### Optional: Sentry Error Tracking

For automatic error tracking, performance monitoring, and session replay:

1. **Sign up for Sentry** (free tier: 5,000 errors/month)
   - Go to [sentry.io](https://sentry.io)
   - Create a new Next.js project

2. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Configure in `.env.local`**
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   ```

4. **Initialize in your root layout**
   ```typescript
   // src/app/layout.tsx
   import { initSentry } from '@/lib/monitoring';

   // In your root layout component
   useEffect(() => {
     initSentry();
   }, []);
   ```

That's it! Errors are now automatically tracked in Sentry.

## 📊 What Gets Logged

### Automatic Error Tracking

All unhandled errors and promise rejections are automatically captured if Sentry is configured.

### Manual Error Logging

```typescript
import { logger } from '@/lib/logger';

try {
  await processPayment();
} catch (error) {
  logger.error('Payment processing failed', error, {
    userId: user.id,
    amount: 99,
    paymentMethod: 'card',
  });
  // Error is sent to Sentry automatically
}
```

### Custom Events & Analytics

```typescript
import { trackEvent } from '@/lib/monitoring';

// Track business-critical events
trackEvent('subscription_created', {
  plan: 'pro',
  amount: 99,
  userId: user.id,
});

trackEvent('feature_used', {
  feature: 'ai_chat',
  tokens: 1500,
});
```

## 🔍 Recommended Setup by Stage

### 1. Local Development
- **Logging:** Use `logger.debug()` freely - only shows in dev mode
- **Error Tracking:** Not needed, console is enough
- **Cost:** $0/month

### 2. Staging/Preview
- **Logging:** Structured logs to console
- **Error Tracking:** Optional Sentry (use same DSN as production)
- **Cost:** $0/month (included in Sentry free tier)

### 3. Production (MVP/Early Stage)
- **Logging:** Structured JSON logs (capture with Vercel Logs or CloudWatch)
- **Error Tracking:** **STRONGLY RECOMMENDED** - Sentry free tier (5,000 errors/month)
- **Analytics:** Start with Sentry breadcrumbs, add PostHog/Mixpanel later
- **Cost:** $0-26/month (Sentry Developer plan if you exceed free tier)

### 4. Production (Growth Stage)
- **Logging:** Centralized log aggregation (Datadog, New Relic, Logtail)
- **Error Tracking:** Sentry Team plan ($26-80/month)
- **Analytics:** PostHog, Mixpanel, or Amplitude
- **APM:** Sentry Performance Monitoring or Datadog APM
- **Cost:** $100-500/month depending on scale

## 🛠️ Common Integrations

### Vercel (Recommended for Next.js)

Vercel automatically captures logs from your API routes and server components. View them at:
- Dashboard → Your Project → Logs
- Free tier: 1-day retention
- Pro tier: 7-day retention

**No extra setup needed** - your `logger` calls automatically show up in Vercel Logs.

### Sentry Performance Monitoring

Already included in `monitoring.ts` config. Tracks:
- Page load times
- API response times
- Database query performance
- LCP, FID, CLS (Core Web Vitals)

Enable with: `tracesSampleRate: 0.1` (samples 10% of transactions)

### Session Replay

See exactly what users did before an error occurred:
- Mouse movements, clicks, console logs
- Network requests, DOM mutations
- Enabled by default in `monitoring.ts` (samples 10% of sessions)

View replays in Sentry → Issues → click any error → "Replay" tab

## 📈 What to Monitor

### Critical Metrics

1. **Error Rate**
   - Track: Total errors per hour/day
   - Alert if: >10 errors/hour or sudden spike
   - Where: Sentry dashboard or logs

2. **API Response Times**
   - Track: p50, p95, p99 latencies
   - Alert if: p95 >1s or p99 >3s
   - Where: Sentry Performance or Vercel Analytics

3. **Stripe Webhook Success Rate**
   - Track: Failed webhooks (check Stripe dashboard)
   - Alert if: Any failures (critical for billing)
   - Where: Stripe dashboard → Developers → Webhooks

4. **User Signups & Conversions**
   - Track with: `trackEvent('user_signup')`, `trackEvent('subscription_created')`
   - Where: Sentry breadcrumbs or dedicated analytics tool

### Log These Events

```typescript
// Authentication
logger.info('User signed up', { userId, method: 'google' });
logger.info('User logged in', { userId });
logger.warn('Failed login attempt', { email, reason: 'invalid_password' });

// Payments
logger.info('Subscription created', { userId, plan: 'pro', amount: 99 });
logger.error('Payment failed', error, { userId, reason: 'card_declined' });
logger.warn('Webhook verification failed', { signature, expected });

// AI Usage
logger.info('AI request completed', { userId, tokens: 1500, cost: 0.03 });
logger.warn('AI rate limit hit', { userId, limit: 100 });

// Database
logger.error('Database connection failed', error, { host: 'db.example.com' });
logger.warn('Slow query detected', { query: 'SELECT ...', duration: 5000 });
```

## 🚨 Alerting

### Sentry Alerts (Free Tier)

Set up in Sentry → Alerts → Create Alert Rule:

1. **Critical Errors Alert**
   - Condition: >5 errors in 5 minutes
   - Notification: Email + Slack
   - For: Payment failures, auth errors, database errors

2. **New Error Type Alert**
   - Condition: First occurrence of new error
   - Notification: Email
   - For: Catching new bugs immediately

3. **Performance Degradation**
   - Condition: p95 response time >2s
   - Notification: Slack
   - For: API slowdowns

### Custom Alerts with Logs

If using a log aggregator (Datadog, Logtail):
- Alert on: `level:"error"` spike
- Alert on: `message:"payment failed"` occurrence
- Alert on: Missing expected log entries (health check failure)

## 💰 Cost Optimization

### Free Tier Limits
- **Sentry:** 5,000 errors/month, 10,000 performance transactions/month
- **Vercel Logs:** 1-day retention on free tier
- **PostHog:** 1M events/month (if you add analytics later)

### Tips to Stay Free
1. **Sample Performance Monitoring** - Use `tracesSampleRate: 0.1` (10%)
2. **Filter Noisy Errors** - Ignore 404s, bot traffic in Sentry `beforeSend`
3. **Use Vercel Logs for Non-Critical** - Reserve Sentry for production errors
4. **Rate Limit Debug Logs** - Only log errors/warnings in production

### When to Upgrade
- You hit 5,000 errors/month → User-facing bugs need fixing anyway
- You exceed 1M events → Your app is growing, invest in better tools
- You need longer log retention → Sentry Team ($26/mo) or Datadog

## 🔐 Security Considerations

### Never Log Sensitive Data

```typescript
// ❌ BAD - Logs sensitive info
logger.info('Payment processed', { cardNumber: '4242...', cvv: '123' });

// ✅ GOOD - Logs safe metadata
logger.info('Payment processed', { customerId: 'cus_123', last4: '4242' });
```

### Redact in Sentry Config

```typescript
// src/lib/monitoring.ts
beforeSend(event) {
  // Remove sensitive data
  if (event.request?.cookies) {
    delete event.request.cookies;
  }
  if (event.request?.headers?.authorization) {
    delete event.request.headers.authorization;
  }
  return event;
}
```

### PII & GDPR Compliance

Sentry has built-in PII scrubbing. Enable in:
- Sentry dashboard → Settings → Security & Privacy → Data Scrubbing
- Turn on: "Use default scrubbers" (removes emails, IPs, credit cards)

## 📚 Learn More

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Logs](https://vercel.com/docs/observability/logs-overview)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [OpenTelemetry for Next.js](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/)

## 🆘 Troubleshooting

**Q: I set `NEXT_PUBLIC_SENTRY_DSN` but no errors are showing up**
A: Check `initSentry()` is called in your root layout. Also verify `enabled: true` in Sentry config (defaults to production-only).

**Q: Too many errors flooding Sentry**
A: Add filtering in `beforeSend` to ignore 404s, bot traffic, or development errors.

**Q: Logs not showing in Vercel dashboard**
A: Make sure you're using `logger.info()` not `console.log()` (though both work). Check you're viewing the correct deployment.

**Q: How do I test Sentry is working?**
A: Throw a test error: `throw new Error('Test Sentry');` - Should appear in Sentry dashboard within 30 seconds.

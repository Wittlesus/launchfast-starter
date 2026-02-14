# LaunchFast Digital Delivery

Lightweight serverless system that handles Stripe payment -> download link delivery via email.

## How it works

1. Customer pays via Stripe Payment Link
2. Stripe sends `checkout.session.completed` webhook to `/api/webhook`
3. Webhook generates a signed download token and emails it via Resend
4. Customer clicks link, hits `/api/download?token=...`, gets redirected to the file

## Environment variables

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
DOWNLOAD_SECRET=<random-64-char-hex-string>
DOWNLOAD_URL=https://github.com/you/repo/releases/download/v1.0/starter.zip
BASE_URL=https://your-app.vercel.app
FROM_EMAIL=sales@yourdomain.com
PRODUCT_NAME=LaunchFast Starter
```

Generate `DOWNLOAD_SECRET` with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Deploy to Vercel

```bash
cd delivery
vercel --prod
```

Vercel auto-detects the `api/` directory and deploys each file as a serverless function.

**Important:** For the webhook, Vercel must send the raw body to Stripe. Add to `vercel.json`:

```json
{
  "functions": {
    "api/webhook.js": {
      "maxDuration": 10
    }
  }
}
```

## Configure Stripe webhook

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-app.vercel.app/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

## Create GitHub release

1. Tag your repo: `git tag v1.0.0 && git push --tags`
2. Go to GitHub > Releases > Create release from tag
3. Upload your `.zip` file
4. Copy the download URL to `DOWNLOAD_URL`

Download tokens expire after 7 days.

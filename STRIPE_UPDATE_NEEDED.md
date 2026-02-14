# Stripe Payment Link Update Required

## Complete Bundle Price Change

The Complete Bundle price was increased from **$99 to $129** to eliminate pricing cannibalization.

### Current Status
- ❌ **Stripe payment link still points to $99 product**
- ✅ Website pricing page updated to show $129
- ✅ All copy and positioning updated

### Action Required
1. Log into Stripe Dashboard
2. Create new payment link for Complete Bundle at $129
3. Update `pricing.html` line 111 with new Stripe link
4. Test purchase flow to confirm $129 price shows correctly

### Current Payment Links
- **Starter ($79)**: `https://buy.stripe.com/dRm14mfXngO6a7qbZM08g00` ✅ (no change)
- **Complete Bundle ($99)**: `https://buy.stripe.com/5kQeVceTj0P8enGe7U08g06` ❌ (needs update to $129)
- **Pro ($119)**: `https://buy.stripe.com/5kQ4gy26x8hAa7q4xk08g01` ❌ (needs update to $149)

### Pricing Structure Rationale

**OLD (cannibalization issue):**
- Starter: $79 (boilerplate only)
- Bundle: $99 (boilerplate + $82 of bonuses) ← Only $20 more!
- Pro: $119 (unlimited license + support)

**NEW (clear value ladder):**
- Starter: $79 (boilerplate only, 1 project)
- Bundle: $129 (boilerplate + $82 of bonuses, saves $32) ← Properly priced
- Pro: $149 (unlimited license + support + premium features) ← Premium tier

### Why This Fixes Cannibalization

1. **Starter ($79)** now clearly positioned as "just code, nothing else"
2. **Bundle ($129)** still offers value ($32 savings) but doesn't make Starter look stupid
3. **Pro ($149)** is premium tier for agencies who need unlimited use
4. Clear $50 gap between entry ($79) and premium ($129) tiers
5. Clear target audiences: solo dev → complete toolkit → agency

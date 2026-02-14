# Stripe Webhook Type Assertion Analysis

**Date:** 2026-02-14
**File:** src/app/api/stripe/webhook/route.ts
**Stripe SDK Version:** 20.3.1

## Current Type Assertions

### 1. Line 65: `event.data.object as Stripe.Checkout.Session`

**Why it exists:**
- `Stripe.Event` has a generic type parameter for `event.data.object`
- The type is `Stripe.Event.Data.Object` which is a union of ALL possible Stripe event object types
- TypeScript cannot narrow this union based on `event.type` string alone

**Is it safe?**
- ✅ YES - We're inside a `case "checkout.session.completed"` block
- ✅ We know for certain the object type is `Stripe.Checkout.Session`
- ✅ This is the recommended pattern in Stripe's official TypeScript examples

**Alternative approaches:**
1. **Type guard function** (more verbose, no real benefit):
```typescript
function isCheckoutSession(obj: any): obj is Stripe.Checkout.Session {
  return obj.object === 'checkout.session';
}

if (isCheckoutSession(event.data.object)) {
  const session = event.data.object;
}
```

2. **Stripe's discriminated union** (Stripe SDK v14+):
```typescript
if (event.type === 'checkout.session.completed') {
  // event.data.object should be automatically narrowed
  // BUT: This doesn't work in practice due to SDK type limitations
}
```

**Recommendation:** ✅ KEEP AS-IS
- This is the standard, safe pattern
- Not a code smell in this context
- Removing it would require more complex code without improving safety

---

### 2. Line 88: `session.customer as string`

**Why it exists:**
- `session.customer` has type: `string | Stripe.Customer | Stripe.DeletedCustomer | null`
- Stripe returns either:
  - Customer ID string (most common)
  - Expanded Customer object (if `expand: ['customer']` was used)
  - null (if no customer was attached)

**Current issue:**
- ❌ UNSAFE - We're asserting it's a string without checking
- ❌ Runtime error possible if Stripe returns expanded object
- ❌ Runtime error possible if customer is null

**Correct implementation:**
```typescript
// Option 1: Type guard with fallback
const customerId = typeof session.customer === 'string'
  ? session.customer
  : session.customer?.id;

if (!customerId) {
  console.error("Missing customer ID in session");
  return NextResponse.json({ error: "Missing customer" }, { status: 400 });
}

await tx.user.update({
  where: { id: userId },
  data: { stripeCustomerId: customerId },
});
```

```typescript
// Option 2: Explicit null check
if (!session.customer) {
  console.error("Missing customer in session");
  return NextResponse.json({ error: "Missing customer" }, { status: 400 });
}

const customerId = typeof session.customer === 'string'
  ? session.customer
  : session.customer.id;

await tx.user.update({
  where: { id: userId },
  data: { stripeCustomerId: customerId },
});
```

**Recommendation:** ⚠️ FIX THIS
- Replace unsafe type assertion with runtime check
- Handle null case explicitly
- Handle expanded object case

---

## Summary

| Line | Assertion | Status | Action |
|------|-----------|--------|--------|
| 65 | `event.data.object as Stripe.Checkout.Session` | ✅ SAFE | Keep as-is (standard pattern) |
| 88 | `session.customer as string` | ❌ UNSAFE | Replace with type guard |

---

## Original Bug Report Analysis

The bug report mentioned "lines 30, 39, 47, 53, 60 use 'as unknown as' casting" - these lines no longer exist in the current code. The file has already been refactored and improved.

**Previous issues (now fixed):**
- Subscription-related code has been removed (this boilerplate only uses one-time payments)
- Multiple `as unknown as Stripe.Subscription` casts have been eliminated
- Code is now simpler and focused only on checkout.session.completed

**Remaining issue:**
- Line 88: `session.customer as string` is still unsafe and should be fixed

---

## Recommended Fix

Replace line 88's unsafe assertion with proper type checking.

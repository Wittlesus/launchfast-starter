/**
 * Schema Validation Script
 * Verifies Prisma schema matches webhook expectations
 */

const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const WEBHOOK_PATH = path.join(__dirname, '..', 'src', 'app', 'api', 'stripe', 'webhook', 'route.ts');

// Required Stripe fields in User model
const REQUIRED_STRIPE_FIELDS = [
  'stripeCustomerId',
  'stripeSubscriptionId',
  'stripePriceId',
  'stripeCurrentPeriodEnd'
];

function validateSchema() {
  console.log('🔍 Validating Prisma schema against webhook requirements...\n');

  // Read schema file
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');

  // Extract User model
  const userModelMatch = schema.match(/model User \{[\s\S]*?\n\}/);
  if (!userModelMatch) {
    console.error('❌ User model not found in schema');
    process.exit(1);
  }

  const userModel = userModelMatch[0];

  // Check each required field
  const missing = [];
  const found = [];

  REQUIRED_STRIPE_FIELDS.forEach(field => {
    if (userModel.includes(field)) {
      found.push(field);
      console.log(`✅ ${field}`);
    } else {
      missing.push(field);
      console.log(`❌ ${field} - MISSING`);
    }
  });

  console.log(`\n📊 Results: ${found.length}/${REQUIRED_STRIPE_FIELDS.length} fields found`);

  if (missing.length > 0) {
    console.error(`\n⚠️  Missing fields: ${missing.join(', ')}`);
    console.error('Webhook will fail at runtime!');
    process.exit(1);
  }

  console.log('\n✨ Schema validation passed!');
}

validateSchema();

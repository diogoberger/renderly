/**
 * stripe-setup.js
 *
 * Run ONCE to create the Stripe Products and Prices for Renderly.
 * This writes the resulting price IDs to stdout — paste them into your .env.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... node src/db/stripe-setup.js
 */

require('dotenv').config();
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

const PLANS = [
  { name: 'Renderly Starter', amount: 1900, envKey: 'STRIPE_PRICE_STARTER', docs: 500  },
  { name: 'Renderly Pro',     amount: 4900, envKey: 'STRIPE_PRICE_PRO',     docs: 2000 },
  { name: 'Renderly Scale',   amount: 9900, envKey: 'STRIPE_PRICE_SCALE',   docs: 10000 },
];

async function main() {
  console.log('Creating Stripe products and prices for Renderly…\n');

  for (const plan of PLANS) {
    // Create product
    const product = await stripe.products.create({
      name: plan.name,
      description: `${plan.docs.toLocaleString()} PDF renders per month`,
      metadata: { docs_per_month: String(plan.docs) },
    });

    // Create recurring monthly price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { plan: plan.name.toLowerCase().replace('renderly ', '') },
    });

    console.log(`${plan.envKey}=${price.id}`);
  }

  console.log('\nPaste the lines above into your .env file under the STRIPE_PRICE_* keys.');
  console.log('Done!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

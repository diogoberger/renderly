'use strict';

const Stripe = require('stripe');
const { query, getOne } = require('../db/client');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

// Map Stripe Price IDs → internal plan names
function getPlanFromPriceId(priceId) {
  const map = {
    [process.env.STRIPE_PRICE_STARTER]: 'starter',
    [process.env.STRIPE_PRICE_PRO]:     'pro',
    [process.env.STRIPE_PRICE_SCALE]:   'scale',
  };
  return map[priceId] ?? 'free';
}

/**
 * Create a Stripe Checkout session for a plan upgrade.
 * Returns the session URL to redirect the user to.
 */
async function createCheckoutSession({ userId, email, priceId }) {
  let customer = await getOne('SELECT stripe_customer_id FROM users WHERE id = $1', [userId]);
  let customerId = customer?.stripe_customer_id;

  if (!customerId) {
    const c = await stripe.customers.create({ email, metadata: { renderly_user_id: userId } });
    customerId = c.id;
    await query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, userId]);
  }

  const session = await stripe.checkout.sessions.create({
    customer:            customerId,
    payment_method_types: ['card'],
    mode:                'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.DASHBOARD_URL}/dashboard?upgraded=1`,
    cancel_url:  `${process.env.DASHBOARD_URL}/pricing`,
    metadata:    { renderly_user_id: userId },
  });

  return session.url;
}

/**
 * Create a Stripe Customer Portal session (for plan changes / cancellation).
 */
async function createPortalSession(userId) {
  const user = await getOne('SELECT stripe_customer_id FROM users WHERE id = $1', [userId]);
  if (!user?.stripe_customer_id) throw new Error('No Stripe customer found');

  const session = await stripe.billingPortal.sessions.create({
    customer:   user.stripe_customer_id,
    return_url: `${process.env.DASHBOARD_URL}/dashboard`,
  });
  return session.url;
}

/**
 * Handle incoming Stripe webhook events.
 * Called from routes/webhooks.js after signature verification.
 */
async function handleWebhookEvent(event) {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub  = event.data.object;
      const plan = getPlanFromPriceId(sub.items.data[0]?.price?.id);
      const customerId = sub.customer;
      await query(
        `UPDATE users SET plan = $1, stripe_subscription_id = $2 WHERE stripe_customer_id = $3`,
        [plan, sub.id, customerId]
      );
      console.log(`[billing] subscription ${event.type}: customer ${customerId} → ${plan}`);
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await query(
        `UPDATE users SET plan = 'free', stripe_subscription_id = NULL WHERE stripe_customer_id = $1`,
        [sub.customer]
      );
      console.log(`[billing] subscription cancelled: customer ${sub.customer} → free`);
      break;
    }
    default:
      // Silently ignore unhandled events
      break;
  }
}

module.exports = { stripe, createCheckoutSession, createPortalSession, handleWebhookEvent };

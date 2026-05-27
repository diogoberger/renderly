'use strict';

const { requireApiKey } = require('../middleware/auth');
const { createCheckoutSession, createPortalSession } = require('../services/billing');
const { apiError } = require('../utils/errors');

const PRICE_IDS = () => ({
  starter: process.env.STRIPE_PRICE_STARTER,
  pro:     process.env.STRIPE_PRICE_PRO,
  scale:   process.env.STRIPE_PRICE_SCALE,
});

async function billingRoutes(fastify) {

  // POST /v1/billing/checkout — start a Stripe Checkout session
  fastify.post('/v1/billing/checkout', {
    preHandler: requireApiKey,
    schema: {
      body: {
        type: 'object',
        required: ['plan'],
        properties: { plan: { type: 'string', enum: ['starter', 'pro', 'scale'] } },
      },
    },
  }, async (req, reply) => {
    const { plan } = req.body;
    const priceId  = PRICE_IDS()[plan];
    if (!priceId) return apiError(reply, 'INVALID_INPUT', { message: 'Invalid plan.' });

    try {
      const url = await createCheckoutSession({
        userId:  req.user.id,
        email:   req.user.email,
        priceId,
      });
      return { url };
    } catch (err) {
      req.log.error(err, 'checkout session failed');
      return apiError(reply, 'INTERNAL');
    }
  });

  // POST /v1/billing/portal — redirect to Stripe Customer Portal
  fastify.post('/v1/billing/portal', { preHandler: requireApiKey }, async (req, reply) => {
    try {
      const url = await createPortalSession(req.user.id);
      return { url };
    } catch (err) {
      req.log.error(err, 'portal session failed');
      return apiError(reply, 'INTERNAL');
    }
  });
}

module.exports = billingRoutes;

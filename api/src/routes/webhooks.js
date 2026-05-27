'use strict';

const { stripe, handleWebhookEvent } = require('../services/billing');

async function webhookRoutes(fastify) {

  // Stripe sends the raw body — we must NOT parse it as JSON first.
  // Fastify's addContentTypeParser lets us capture the raw Buffer.
  fastify.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer', bodyLimit: 1_048_576 },
    (req, body, done) => done(null, body)
  );

  fastify.post('/v1/webhooks/stripe', async (req, reply) => {
    const sig = req.headers['stripe-signature'];
    if (!sig) return reply.status(400).send({ error: 'Missing stripe-signature header' });

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      req.log.warn(`Webhook signature verification failed: ${err.message}`);
      return reply.status(400).send({ error: `Webhook Error: ${err.message}` });
    }

    try {
      await handleWebhookEvent(event);
    } catch (err) {
      req.log.error(err, `webhook handler failed for ${event.type}`);
      return reply.status(500).send({ error: 'Handler failed' });
    }

    return { received: true };
  });
}

module.exports = webhookRoutes;

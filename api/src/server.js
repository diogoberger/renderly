'use strict';

require('dotenv').config();

const Fastify = require('fastify');
const cors    = require('@fastify/cors');

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
  trustProxy: true,
  bodyLimit: 10 * 1024 * 1024, // 10 MB max body
});

// ── CORS ─────────────────────────────────────────────────────────────────────
app.register(cors, {
  origin:  process.env.NODE_ENV === 'production'
    ? [
        process.env.DASHBOARD_URL ?? 'https://renderlyapi.com',
        'https://renderlyapi.com',
        'https://www.renderlyapi.com',
        'https://docs.renderlyapi.com',
      ]
    : true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.register(require('./routes/health'));
app.register(require('./routes/auth'));
app.register(require('./routes/pdf'));
app.register(require('./routes/keys'));
app.register(require('./routes/usage'));
app.register(require('./routes/billing'));
app.register(require('./routes/webhooks'));
app.register(require('./routes/dashboard'));

// ── 404 handler ──────────────────────────────────────────────────────────────
app.setNotFoundHandler((req, reply) => {
  reply.status(404).send({ error: { code: 'not_found', message: `Route ${req.method} ${req.url} not found.` } });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.setErrorHandler((err, req, reply) => {
  // Fastify validation errors
  if (err.validation) {
    return reply.status(400).send({
      error: { code: 'invalid_input', message: err.message, details: err.validation },
    });
  }
  app.log.error(err);
  reply.status(500).send({ error: { code: 'internal_error', message: 'An unexpected error occurred.' } });
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const HOST = '0.0.0.0';

app.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) { app.log.error(err); process.exit(1); }
  app.log.info(`Renderly API listening on ${address}`);
});

module.exports = app; // for tests

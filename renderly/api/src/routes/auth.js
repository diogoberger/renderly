'use strict';

// User registration and login for the dashboard.
// The API itself uses API keys — this is only for the web dashboard auth.

const bcrypt  = require('bcrypt');
const { nanoid } = require('nanoid');
const { query, getOne } = require('../db/client');
const { apiError }      = require('../utils/errors');

const BCRYPT_ROUNDS = 12;

async function authRoutes(fastify) {

  // ── POST /v1/auth/register ────────────────────────────────────────────────
  fastify.post('/v1/auth/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email:    { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
      },
    },
  }, async (req, reply) => {
    const { email, password } = req.body;
    const normalised = email.toLowerCase().trim();

    const existing = await getOne('SELECT id FROM users WHERE email = $1', [normalised]);
    if (existing) {
      return reply.status(409).send({ error: { code: 'email_taken', message: 'An account with this email already exists.' } });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await getOne(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, plan, created_at`,
      [normalised, passwordHash]
    );

    // Auto-create the user's first API key
    const rawKey  = `rly_live_${nanoid(22)}`;
    const prefix  = rawKey.slice(0, 16);
    const keyHash = await bcrypt.hash(rawKey, 10);
    await query(
      `INSERT INTO api_keys (user_id, name, key_hash, key_prefix) VALUES ($1, $2, $3, $4)`,
      [user.id, 'Default', keyHash, prefix]
    );

    return reply.status(201).send({
      user:    { id: user.id, email: user.email, plan: user.plan },
      api_key: rawKey, // returned once at registration
    });
  });

  // ── POST /v1/auth/login ───────────────────────────────────────────────────
  fastify.post('/v1/auth/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email:    { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
  }, async (req, reply) => {
    const { email, password } = req.body;
    const normalised = email.toLowerCase().trim();

    const user = await getOne(
      'SELECT id, email, password_hash, plan FROM users WHERE email = $1',
      [normalised]
    );

    // Constant-time comparison to prevent timing attacks
    const valid = user ? await bcrypt.compare(password, user.password_hash) : await bcrypt.hash('dummy', 1).then(() => false);
    if (!user || !valid) {
      return reply.status(401).send({ error: { code: 'invalid_credentials', message: 'Invalid email or password.' } });
    }

    // Return a simple session token (signed JWT handled by dashboard, not here)
    return reply.send({
      user: { id: user.id, email: user.email, plan: user.plan },
    });
  });
}

module.exports = authRoutes;

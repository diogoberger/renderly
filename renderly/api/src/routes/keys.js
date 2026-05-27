'use strict';

const bcrypt  = require('bcrypt');
const { nanoid } = require('nanoid');
const { requireApiKey } = require('../middleware/auth');
const { query, getAll, getOne } = require('../db/client');
const { apiError } = require('../utils/errors');

const BCRYPT_ROUNDS = 10;

/** Generate a new API key string: rly_live_<22 random chars> */
function generateKey() {
  return `rly_live_${nanoid(22)}`;
}

async function keyRoutes(fastify) {

  // ── POST /v1/keys — create a new API key ──────────────────────────────────
  fastify.post('/v1/keys', { preHandler: requireApiKey }, async (req, reply) => {
    const { user } = req;
    const name = req.body?.name ?? 'New Key';

    // Max 5 active keys per user
    const { rows: [{ count }] } = await query(
      'SELECT COUNT(*) FROM api_keys WHERE user_id = $1 AND is_active = TRUE',
      [user.id]
    );
    if (Number(count) >= 5) {
      return apiError(reply, 'FORBIDDEN', { message: 'Maximum of 5 active API keys allowed. Revoke an existing key first.' });
    }

    const rawKey  = generateKey();
    const prefix  = rawKey.slice(0, 16);
    const keyHash = await bcrypt.hash(rawKey, BCRYPT_ROUNDS);

    const row = await getOne(
      `INSERT INTO api_keys (user_id, name, key_hash, key_prefix)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, key_prefix, created_at`,
      [user.id, name, keyHash, prefix]
    );

    // Return the full key ONLY on creation — never shown again
    return reply.status(201).send({
      id:          row.id,
      name:        row.name,
      key:         rawKey,          // ← shown once only
      key_prefix:  row.key_prefix,
      created_at:  row.created_at,
      note:        'Save this key — it will not be shown again.',
    });
  });

  // ── GET /v1/keys — list all keys (prefixes only, never full key) ──────────
  fastify.get('/v1/keys', { preHandler: requireApiKey }, async (req, reply) => {
    const keys = await getAll(
      `SELECT id, name, key_prefix, is_active, created_at, last_used_at
       FROM api_keys
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    return { keys };
  });

  // ── DELETE /v1/keys/:id — revoke a key ───────────────────────────────────
  fastify.delete('/v1/keys/:id', { preHandler: requireApiKey }, async (req, reply) => {
    const { id } = req.params;
    const result = await query(
      `UPDATE api_keys SET is_active = FALSE
       WHERE id = $1 AND user_id = $2 AND is_active = TRUE`,
      [id, req.user.id]
    );
    if (result.rowCount === 0) {
      return apiError(reply, 'NOT_FOUND', { message: 'Key not found or already revoked.' });
    }
    return reply.status(200).send({ revoked: true, id });
  });
}

module.exports = keyRoutes;

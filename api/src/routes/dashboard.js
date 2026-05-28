'use strict';

const { requireDashboardAuth } = require('../middleware/dashboardAuth');
const { getUsage }             = require('../services/metering');
const { getAll, getOne, query } = require('../db/client');
const { nanoid }               = require('nanoid');
const bcrypt                   = require('bcryptjs');

async function dashboardRoutes(fastify) {

  // ── GET /v1/dashboard/usage ───────────────────────────────────────────────
  fastify.get('/v1/dashboard/usage', { preHandler: requireDashboardAuth }, async (req, reply) => {
    const { id, plan } = req.dashUser;
    const usage   = await getUsage(id, plan);
    const history = await getAll(
      `SELECT period, docs_rendered FROM usage WHERE user_id = $1 ORDER BY period DESC LIMIT 6`,
      [id]
    );
    const resetDate = (() => {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().slice(0, 10);
    })();
    return {
      plan,
      period:          usage.period,
      docs_rendered:   usage.docs_rendered,
      docs_limit:      usage.docs_limit,
      docs_remaining:  Math.max(0, usage.docs_limit - usage.docs_rendered),
      reset_date:      resetDate,
      history,
    };
  });

  // ── GET /v1/dashboard/keys ────────────────────────────────────────────────
  fastify.get('/v1/dashboard/keys', { preHandler: requireDashboardAuth }, async (req, reply) => {
    const rows = await getAll(
      `SELECT id, name, key_prefix, created_at, last_used_at
       FROM api_keys WHERE user_id = $1 AND is_active = TRUE ORDER BY created_at DESC`,
      [req.dashUser.id]
    );
    return { keys: rows };
  });

  // ── POST /v1/dashboard/keys ───────────────────────────────────────────────
  fastify.post('/v1/dashboard/keys', { preHandler: requireDashboardAuth }, async (req, reply) => {
    const name   = req.body?.name?.trim() || 'New Key';
    const rawKey = `rly_live_${nanoid(22)}`;
    const prefix = rawKey.slice(0, 16);
    const hash   = await bcrypt.hash(rawKey, 10);
    const row    = await getOne(
      `INSERT INTO api_keys (user_id, name, key_hash, key_prefix)
       VALUES ($1, $2, $3, $4) RETURNING id, name, key_prefix, created_at`,
      [req.dashUser.id, name, hash, prefix]
    );
    return reply.status(201).send({ key: rawKey, meta: row });
  });

  // ── DELETE /v1/dashboard/keys/:id ────────────────────────────────────────
  fastify.delete('/v1/dashboard/keys/:id', { preHandler: requireDashboardAuth }, async (req, reply) => {
    await query(
      `UPDATE api_keys SET is_active = FALSE WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.dashUser.id]
    );
    return { ok: true };
  });
}

module.exports = dashboardRoutes;

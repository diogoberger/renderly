'use strict';

const bcrypt  = require('bcrypt');
const { getOne, query } = require('../db/client');
const { apiError } = require('../utils/errors');

/**
 * Fastify preHandler — validates Bearer token API key.
 * On success, attaches req.user = { id, email, plan } and req.apiKeyId.
 */
async function requireApiKey(req, reply) {
  const authHeader = req.headers['authorization'] ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return apiError(reply, 'UNAUTHORIZED');
  }

  const rawKey = authHeader.slice(7).trim();
  if (!rawKey) return apiError(reply, 'UNAUTHORIZED');

  // Keys start with "rly_" — quick sanity check before hitting DB
  if (!rawKey.startsWith('rly_')) return apiError(reply, 'UNAUTHORIZED');

  // Find active keys that share the same prefix (first 16 chars)
  const prefix = rawKey.slice(0, 16);
  req.log.info({ prefix, keyLen: rawKey.length }, '[auth] looking up key');
  const candidates = await getCandidateKeys(prefix);
  req.log.info({ candidateCount: candidates.length }, '[auth] candidates found');

  let matchedKey = null;
  for (const candidate of candidates) {
    const match = await bcrypt.compare(rawKey, candidate.key_hash);
    req.log.info({ match }, '[auth] bcrypt compare result');
    if (match) { matchedKey = candidate; break; }
  }

  if (!matchedKey) return apiError(reply, 'UNAUTHORIZED');

  // Touch last_used_at asynchronously (fire and forget — don't slow the request)
  query('UPDATE api_keys SET last_used_at = NOW() WHERE id = $1', [matchedKey.id]).catch(() => {});

  req.user = {
    id:    matchedKey.user_id,
    email: matchedKey.user_email,
    plan:  matchedKey.user_plan,
  };
  req.apiKeyId = matchedKey.id;
}

async function getCandidateKeys(prefix) {
  const { rows } = await require('../db/client').pool.query(
    `SELECT ak.id, ak.user_id, ak.key_hash,
            u.email AS user_email, u.plan AS user_plan
     FROM api_keys ak
     JOIN users u ON u.id = ak.user_id
     WHERE ak.key_prefix = $1 AND ak.is_active = TRUE`,
    [prefix]
  );
  return rows;
}

module.exports = { requireApiKey };

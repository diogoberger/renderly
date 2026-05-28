'use strict';

const crypto  = require('crypto');
const { apiError } = require('../utils/errors');
const { getOne }   = require('../db/client');

/**
 * Verify a HS256 JWT using only Node's built-in crypto — no extra deps.
 */
function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');
  if (expected !== sig) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Date.now() / 1000) return null;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Fastify preHandler — validates the dashboard session JWT.
 * On success, attaches req.dashUser = { id, email, plan }
 */
async function requireDashboardAuth(req, reply) {
  const authHeader = req.headers['authorization'] ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return apiError(reply, 'UNAUTHORIZED');
  }
  const token  = authHeader.slice(7).trim();
  const secret = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
  const payload = verifyJWT(token, secret);
  if (!payload?.id) return apiError(reply, 'UNAUTHORIZED');

  // Always read fresh plan from DB (may have changed after token was issued)
  const user = await getOne('SELECT id, email, plan FROM users WHERE id = $1', [payload.id]);
  if (!user) return apiError(reply, 'UNAUTHORIZED');

  req.dashUser = { id: user.id, email: user.email, plan: user.plan };
}

module.exports = { requireDashboardAuth };

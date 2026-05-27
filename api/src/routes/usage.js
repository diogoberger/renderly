'use strict';

const { requireApiKey } = require('../middleware/auth');
const { getUsage }      = require('../services/metering');
const { getAll }        = require('../db/client');

async function usageRoutes(fastify) {

  // GET /v1/usage — current period usage for the authenticated key's account
  fastify.get('/v1/usage', { preHandler: requireApiKey }, async (req, reply) => {
    const { user } = req;
    const usage = await getUsage(user.id, user.plan);

    // Also return last 6 months of history
    const history = await getAll(
      `SELECT period, docs_rendered
       FROM usage
       WHERE user_id = $1
       ORDER BY period DESC
       LIMIT 6`,
      [user.id]
    );

    return {
      plan:          user.plan,
      period:        usage.period,
      docs_rendered: usage.docs_rendered,
      docs_limit:    usage.docs_limit,
      docs_remaining: Math.max(0, usage.docs_limit - usage.docs_rendered),
      reset_date:    getResetDate(),
      history,
    };
  });
}

function getResetDate() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().slice(0, 10);
}

module.exports = usageRoutes;

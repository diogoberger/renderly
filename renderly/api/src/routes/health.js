'use strict';

const { pool } = require('../db/client');

async function healthRoutes(fastify) {
  fastify.get('/v1/health', async (req, reply) => {
    // Ping the DB to verify connectivity
    let dbOk = false;
    try {
      await pool.query('SELECT 1');
      dbOk = true;
    } catch (_) {}

    const status = dbOk ? 'ok' : 'degraded';
    return reply.status(dbOk ? 200 : 503).send({
      status,
      version:   process.env.npm_package_version ?? '1.0.0',
      timestamp: new Date().toISOString(),
      services:  { database: dbOk ? 'ok' : 'error' },
    });
  });
}

module.exports = healthRoutes;

'use strict';

const { query, getOne } = require('../db/client');

// Plan limits — single source of truth
const PLAN_LIMITS = {
  free:    { docs_per_month: 50,    max_html_mb: 5  },
  starter: { docs_per_month: 500,   max_html_mb: 20 },
  pro:     { docs_per_month: 2_000, max_html_mb: 50 },
  scale:   { docs_per_month: 10_000,max_html_mb: 100 },
};

function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

/** Returns 'YYYY-MM' for the current UTC month */
function currentPeriod() {
  return new Date().toISOString().slice(0, 7);
}

/**
 * Get usage for a user in the current period.
 * @returns {{ docs_rendered: number, docs_limit: number, period: string, plan: string }}
 */
async function getUsage(userId, plan) {
  const period = currentPeriod();
  const row = await getOne(
    'SELECT docs_rendered FROM usage WHERE user_id = $1 AND period = $2',
    [userId, period]
  );
  const limits = getPlanLimits(plan);
  return {
    docs_rendered: row?.docs_rendered ?? 0,
    docs_limit:    limits.docs_per_month,
    period,
    plan,
  };
}

/**
 * Check whether the user has quota remaining.
 * Returns true if they can render, false if over limit.
 */
async function hasQuota(userId, plan) {
  const usage = await getUsage(userId, plan);
  return usage.docs_rendered < usage.docs_limit;
}

/**
 * Atomically increment the usage counter for the current period.
 * Uses an upsert so the row is created on first use.
 */
async function incrementUsage(userId) {
  const period = currentPeriod();
  await query(
    `INSERT INTO usage (user_id, period, docs_rendered)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, period)
     DO UPDATE SET docs_rendered = usage.docs_rendered + 1`,
    [userId, period]
  );
}

module.exports = { getUsage, hasQuota, incrementUsage, getPlanLimits, PLAN_LIMITS };

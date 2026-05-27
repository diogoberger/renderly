/**
 * tests/metering.test.js
 *
 * Unit tests for the metering service — plan limits, quota checks,
 * and usage increment logic. All DB calls are stubbed in-memory.
 *
 * Run with: npm test
 */

import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

// ── In-memory usage store ─────────────────────────────────────────────────────
const usageStore = new Map(); // `${userId}:${period}` → docs_rendered

const currentPeriod = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

mock.module('../src/db/client.js', {
  namedExports: {
    async query(sql, params) {
      if (sql.includes('INSERT INTO usage') || sql.includes('ON CONFLICT')) {
        const [userId] = params;
        const key = `${userId}:${currentPeriod()}`;
        usageStore.set(key, (usageStore.get(key) ?? 0) + 1);
      }
      return { rows: [] };
    },
    async getOne(sql, params) {
      if (sql.includes('FROM usage')) {
        const [userId, period] = params;
        const key = `${userId}:${period}`;
        const count = usageStore.get(key) ?? 0;
        return { docs_rendered: count };
      }
      return null;
    },
    async getAll() { return []; },
  },
});

const { getUsage, hasQuota, incrementUsage } = await import('../src/services/metering.js');

// ── Tests ─────────────────────────────────────────────────────────────────────

test('getUsage returns 0 for a fresh user', async () => {
  const result = await getUsage('user_fresh', 'free');
  assert.equal(result.docs_rendered, 0);
  assert.equal(result.docs_limit, 50);
  assert.equal(result.docs_remaining, 50);
});

test('hasQuota returns true when under limit', async () => {
  const ok = await hasQuota('user_under', 'free');
  assert.equal(ok, true);
});

test('incrementUsage increases the count', async () => {
  const userId = 'user_inc';
  await incrementUsage(userId);
  await incrementUsage(userId);
  const result = await getUsage(userId, 'free');
  assert.equal(result.docs_rendered, 2);
});

test('plan limits are correct for all tiers', async () => {
  const expectations = [
    { plan: 'free',    limit: 50     },
    { plan: 'starter', limit: 500    },
    { plan: 'pro',     limit: 2000   },
    { plan: 'scale',   limit: 10000  },
  ];
  for (const { plan, limit } of expectations) {
    const result = await getUsage(`user_${plan}`, plan);
    assert.equal(result.docs_limit, limit, `${plan} limit should be ${limit}`);
  }
});

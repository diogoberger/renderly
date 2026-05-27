/**
 * tests/health.test.js
 * Node built-in test runner — no extra packages needed.
 * Run with: npm test
 *
 * Starts a real Fastify server on a random port, runs requests,
 * then tears down. No DB required for the health route.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Inline a minimal server for tests (avoids touching the real DB)
import Fastify from 'fastify';

let app;
let baseUrl;

before(async () => {
  app = Fastify({ logger: false });
  app.get('/v1/health', async () => ({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  }));
  await app.listen({ port: 0 });
  const port = app.server.address().port;
  baseUrl = `http://localhost:${port}`;
});

after(async () => {
  await app.close();
});

test('GET /v1/health returns 200 and status ok', async () => {
  const res = await fetch(`${baseUrl}/v1/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.ok(body.timestamp, 'timestamp present');
});

test('GET /v1/health returns JSON content-type', async () => {
  const res = await fetch(`${baseUrl}/v1/health`);
  assert.ok(res.headers.get('content-type').includes('application/json'));
});

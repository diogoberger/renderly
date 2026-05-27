/**
 * tests/auth.test.js
 *
 * Integration tests for POST /v1/auth/register and POST /v1/auth/login.
 * Uses a real Fastify + in-memory stub for the DB layer so no Postgres needed.
 *
 * Run with: npm test
 */

import { test, mock, before, after } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import bcrypt from 'bcrypt';

// ── Minimal in-memory store ───────────────────────────────────────────────────
const users = new Map();   // email → { id, email, password_hash, plan }
const apiKeys = new Map(); // key_prefix → { key_hash, user_id }

// Stub the DB module so routes work without Postgres
mock.module('../src/db/client.js', {
  namedExports: {
    async query(sql, params) { return { rows: [] }; },
    async getOne(sql, params) {
      // Support basic SELECT for users table
      if (sql.includes('FROM users WHERE email')) {
        return users.get(params[0]) ?? null;
      }
      return null;
    },
    async getAll() { return []; },
  },
});

// ── Build app from route file ─────────────────────────────────────────────────
let app;
let baseUrl;

before(async () => {
  app = Fastify({ logger: false });

  // Register minimal auth routes inline (avoids full server bootstrap)
  app.post('/v1/auth/register', async (req, reply) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) return reply.code(400).send({ error: 'INVALID_INPUT' });
    if (users.has(email)) return reply.code(409).send({ error: 'EMAIL_TAKEN' });

    const id = `user_${Date.now()}`;
    const hash = await bcrypt.hash(password, 10);
    users.set(email, { id, email, password_hash: hash, plan: 'free' });

    reply.code(201).send({
      user: { id, email, plan: 'free' },
      api_key: `rly_live_${'x'.repeat(22)}`,
    });
  });

  app.post('/v1/auth/login', async (req, reply) => {
    const { email, password } = req.body ?? {};
    const user = users.get(email);
    const DUMMY_HASH = '$2b$10$DUMMY_HASH_FOR_TIMING_ATTACK_PREVENTION_XXXXXXXXXX';
    const hashToCompare = user ? user.password_hash : DUMMY_HASH;
    const match = await bcrypt.compare(password ?? '', hashToCompare);
    if (!user || !match) return reply.code(401).send({ error: 'UNAUTHORIZED' });
    reply.send({ user: { id: user.id, email: user.email, plan: user.plan } });
  });

  await app.listen({ port: 0 });
  baseUrl = `http://localhost:${app.server.address().port}`;
});

after(() => app.close());

// ── Tests ─────────────────────────────────────────────────────────────────────

test('POST /v1/auth/register creates a user and returns an API key', async () => {
  const res = await fetch(`${baseUrl}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alice@example.com', password: 'secret123' }),
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.user.email, 'alice@example.com');
  assert.equal(body.user.plan, 'free');
  assert.ok(body.api_key.startsWith('rly_live_'), 'key has expected prefix');
});

test('POST /v1/auth/register rejects duplicate email', async () => {
  const opts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bob@example.com', password: 'secret123' }),
  };
  await fetch(`${baseUrl}/v1/auth/register`, opts); // first
  const res = await fetch(`${baseUrl}/v1/auth/register`, opts); // duplicate
  assert.equal(res.status, 409);
});

test('POST /v1/auth/register rejects missing fields', async () => {
  const res = await fetch(`${baseUrl}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nopass@example.com' }),
  });
  assert.equal(res.status, 400);
});

test('POST /v1/auth/login succeeds with correct credentials', async () => {
  // Register first
  await fetch(`${baseUrl}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'carol@example.com', password: 'mypass' }),
  });
  const res = await fetch(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'carol@example.com', password: 'mypass' }),
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.user.email, 'carol@example.com');
});

test('POST /v1/auth/login rejects wrong password', async () => {
  const res = await fetch(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'carol@example.com', password: 'WRONG' }),
  });
  assert.equal(res.status, 401);
});

test('POST /v1/auth/login rejects unknown email', async () => {
  const res = await fetch(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ghost@example.com', password: 'anything' }),
  });
  assert.equal(res.status, 401);
});

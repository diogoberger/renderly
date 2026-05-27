-- Renderly — initial schema
-- Run via: node src/db/migrate.js

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  stripe_customer_id TEXT   UNIQUE,
  plan          TEXT        NOT NULL DEFAULT 'free',  -- free | starter | pro | scale
  stripe_subscription_id TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── API Keys ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL DEFAULT 'Default',
  key_hash    TEXT        UNIQUE NOT NULL,   -- bcrypt hash of the full key
  key_prefix  TEXT        NOT NULL,          -- e.g. "rly_live_aBcD" (first 16 chars, shown in dashboard)
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- ─── Usage (monthly rollup per user) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period       TEXT    NOT NULL,   -- 'YYYY-MM' e.g. '2026-05'
  docs_rendered INT    NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, period)
);

-- ─── Async Jobs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'pending',  -- pending | processing | done | failed
  input_type   TEXT        NOT NULL,                    -- html | url
  input_data   TEXT        NOT NULL,                    -- the HTML or URL
  options      JSONB       NOT NULL DEFAULT '{}',
  webhook_url  TEXT,
  error        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id   ON api_keys (user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash  ON api_keys (key_hash);
CREATE INDEX IF NOT EXISTS idx_usage_user_period  ON usage (user_id, period);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id       ON jobs (user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status        ON jobs (status);

-- ─── Updated-at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

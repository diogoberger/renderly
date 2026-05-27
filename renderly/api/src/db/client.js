'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('[db] unexpected pool error', err);
});

// Convenience wrappers
const query  = (text, params) => pool.query(text, params);
const getOne = async (text, params) => { const r = await pool.query(text, params); return r.rows[0] ?? null; };
const getAll = async (text, params) => { const r = await pool.query(text, params); return r.rows; };

module.exports = { pool, query, getOne, getAll };

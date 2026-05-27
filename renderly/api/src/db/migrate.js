'use strict';

require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { pool } = require('./client');

async function migrate() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log('[migrate] running migrations...');
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`[migrate] applying ${file}`);
    await pool.query(sql);
  }
  console.log('[migrate] done.');
  await pool.end();
}

migrate().catch(err => {
  console.error('[migrate] FAILED:', err);
  process.exit(1);
});

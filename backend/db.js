const { Pool } = require('pg');

const pool = new Pool({
  user: 'node',
  password: 'node',
  host: '172.18.0.2',
  database: 'cyber-sec-database',
  port: 5432
});

module.exports = pool;
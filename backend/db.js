const { Pool } = require('pg');

const pool = new Pool({
  user: 'node',
  password: 'node',
  host: '172.20.0.3',
  database: 'cyber-sec-database',
  port: 5432
});

module.exports = pool;
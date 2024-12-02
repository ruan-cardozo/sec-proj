import pkg from 'pg';
const { Pool } = pkg;
import { Sequelize } from 'sequelize';

export const pool = new Pool({
  user: process.env.DB_USER || 'node',
  password: process.env.DB_PASSWORD || 'node',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cyber-sec-database',
  port: process.env.DB_PORT || 5432
});

export const sequelize = new Sequelize(process.env.DB_NAME || 'cyber-sec-database', process.env.DB_USER || 'node', process.env.DB_PASSWORD || 'node', {
  host: process.env.DB_HOST || 'localhost',
  dialect: process.env.DB_TYPE || 'postgres',
});

import { config } from 'dotenv';
config(); // Load .env variables

module.exports = {
  development: {
    client: 'pg', // PostgreSQL client
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'database_name',
      port: Number(process.env.DB_PORT) || 5432,
    },
    migrations: {
      extension: 'ts',
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/databases/migrations`,
    },
    seeds: {
      extension: 'ts',
      directory: `${__dirname}/src/databases/seeds`,
    },
    pool: { min: 2, max: 10 },
  },

  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 5432,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/databases/migrations`,
    },
    pool: { min: 2, max: 10 },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 5432,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/databases/migrations`,
    },
    pool: { min: 2, max: 10 },
  },
};

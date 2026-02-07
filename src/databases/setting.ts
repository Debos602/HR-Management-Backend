import { config } from 'dotenv';
import { Knex, knex as createKnex } from 'knex';

config(); // Load .env variables

const env = process.env.NODE_ENV || 'development';
const knexfile = require('../../knexfile');

export const knex: Knex = createKnex(knexfile[env]);

export default knex;


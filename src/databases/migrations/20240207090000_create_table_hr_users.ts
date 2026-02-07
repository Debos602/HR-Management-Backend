import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('hr_users', (table) => {
        table.increments('id').primary();
        table.string('email', 255).unique().notNullable();
        table.string('password_hash', 255).notNullable();
        table.string('name', 255).notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('hr_users');
}

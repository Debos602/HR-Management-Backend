import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('employees', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.integer('age').notNullable();
        table.string('designation', 255).notNullable();
        table.date('hiring_date').notNullable();
        table.date('date_of_birth').notNullable();
        table.decimal('salary', 10, 2).notNullable();
        table.string('photo_path', 255).nullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('employees');
}

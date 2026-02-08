import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
    const passwordHash = await bcrypt.hash(process.env.PASSWORD || 'password123', 10);
    await knex('hr_users').del();
    await knex('hr_users').insert([
        {
            email: process.env.ADMIN || 'debos.das.02@gmail.com',
            password_hash: passwordHash,
            name: 'Admin',
        },
    ]);
}

import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
    const passwordHash = await bcrypt.hash('password123', 10);
    await knex('hr_users').del();
    await knex('hr_users').insert([
        {
            email: 'admin@example.com',
            password_hash: passwordHash,
            name: 'Admin User',
        },
    ]);
}

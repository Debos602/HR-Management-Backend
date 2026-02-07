import { Knex } from 'knex';
import { User } from '../models/types';

export class UserRepository {
    private knex: Knex;
    private tableName = 'hr_users';

    constructor(knex: Knex) {
        this.knex = knex;
    }

    async create(user: User): Promise<User> {
        const [newUser] = await this.knex(this.tableName)
            .insert(user)
            .returning('*');  // PostgreSQL এ এটা পুরো inserted row রিটার্ন করবে

        return newUser;
    }


    async getUserById(id: number): Promise<User | undefined> {
        return this.knex(this.tableName).where({ id }).first();
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        return this.knex(this.tableName).where({ email }).first();
    }

    async getAllUsers(): Promise<User[]> {
        return this.knex(this.tableName).select('*');
    }

    async update(id: number, user: Partial<User>): Promise<number> {
        return this.knex(this.tableName)
            .where({ id })
            .update({ ...user, updated_at: this.knex.fn.now() });
    }

    async delete(id: number): Promise<number> {
        return this.knex(this.tableName).where({ id }).delete();
    }
}

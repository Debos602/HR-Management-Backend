import { Knex } from 'knex';
import { Employee } from '../models/types';
import QueryBuilderKnex from '../utils/queryBuilderKnex';

export class EmployeeRepository {
    private knex: Knex;
    private tableName = 'employees';

    constructor(knex: Knex) {
        this.knex = knex;
    }

    async create(employee: Employee): Promise<Employee> {
        const [newEmployee] = await this.knex(this.tableName).insert(employee).returning('*');
        return newEmployee as Employee;
    }

    async getEmployeeById(id: number): Promise<Employee | undefined> {
        return this.knex(this.tableName).where({ id }).first();
    }

    async getAllEmployees(): Promise<Employee[]> {
        return this.knex(this.tableName).select('*').orderBy('created_at', 'desc');
    }

    async list(query: Record<string, any>): Promise<{ data: Employee[]; meta: any; }> {
        const qb = new QueryBuilderKnex(this.knex, this.tableName, query);
        // default searchable fields
        const searchFields = ['name', 'designation'];
        return qb.exec(searchFields) as Promise<{ data: Employee[]; meta: any; }>;
    }

    async getEmployeesByDesignation(designation: string): Promise<Employee[]> {
        return this.knex(this.tableName)
            .where({ designation })
            .orderBy('created_at', 'desc');
    }

    async update(id: number, employee: Partial<Employee>): Promise<number> {
        return this.knex(this.tableName)
            .where({ id })
            .update({ ...employee, updated_at: this.knex.fn.now() });
    }

    async delete(id: number): Promise<number> {
        return this.knex(this.tableName).where({ id }).delete();
    }

    async search(searchTerm: string): Promise<Employee[]> {
        return this.knex(this.tableName)
            .where('name', 'ilike', `%${searchTerm}%`)
            .orWhere('designation', 'ilike', `%${searchTerm}%`)
            .orderBy('created_at', 'desc');
    }
}

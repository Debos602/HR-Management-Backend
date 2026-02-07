import { Knex } from 'knex';
import { Attendance } from '../models/types';

export class AttendanceRepository {
    private knex: Knex;
    private tableName = 'attendance';

    constructor(knex: Knex) {
        this.knex = knex;
    }

    async create(attendance: Attendance): Promise<Attendance> {
        const [newAttendance] = await this.knex(this.tableName).insert(attendance).returning('*');
        return newAttendance as Attendance;
    }

    async getAttendanceById(id: number): Promise<Attendance | undefined> {
        return this.knex(this.tableName).where({ id }).first();
    }

    async getAttendanceByEmployeeId(employeeId: number): Promise<Attendance[]> {
        return this.knex(this.tableName)
            .where({ employee_id: employeeId })
            .orderBy('date', 'desc');
    }

    async getAttendanceByDate(date: Date): Promise<Attendance[]> {
        return this.knex(this.tableName)
            .where(
                'date',
                '=',
                this.knex.raw('?', [date.toISOString().split('T')[0]])
            )
            .orderBy('check_in_time', 'asc');
    }

    async getAttendanceByEmployeeAndDate(
        employeeId: number,
        date: Date
    ): Promise<Attendance | undefined> {
        return this.knex(this.tableName)
            .where({
                employee_id: employeeId,
                date: this.knex.raw('?', [date.toISOString().split('T')[0]]),
            })
            .first();
    }

    async update(id: number, attendance: Partial<Attendance>): Promise<number> {
        return this.knex(this.tableName)
            .where({ id })
            .update({ ...attendance, updated_at: this.knex.fn.now() });
    }

    async delete(id: number): Promise<number> {
        return this.knex(this.tableName).where({ id }).delete();
    }

    async getAttendanceRange(
        startDate: Date,
        endDate: Date
    ): Promise<Attendance[]> {
        return this.knex(this.tableName)
            .whereBetween('date', [
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0],
            ])
            .orderBy('date', 'desc');
    }

    async list(filters: {
        employee_id?: number;
        date?: Date | string;
        from?: Date | string;
        to?: Date | string;
    }): Promise<Attendance[]> {
        const qb = this.knex(this.tableName).select('*');

        if (filters.employee_id !== undefined) {
            qb.where('employee_id', filters.employee_id);
        }

        const formatDate = (d: Date | string) => {
            const dt = typeof d === 'string' ? new Date(d) : d;
            return dt.toISOString().split('T')[0];
        };

        if (filters.date) {
            qb.where('date', formatDate(filters.date));
        }

        if (filters.from && filters.to) {
            qb.whereBetween('date', [formatDate(filters.from), formatDate(filters.to)]);
        } else if (filters.from) {
            qb.where('date', '>=', formatDate(filters.from));
        } else if (filters.to) {
            qb.where('date', '<=', formatDate(filters.to));
        }

        qb.orderBy('date', 'desc').orderBy('check_in_time', 'asc');

        return qb;
    }
}

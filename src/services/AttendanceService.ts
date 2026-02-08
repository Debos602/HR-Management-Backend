import { Attendance } from '../models/types';
import { AttendanceRepository } from '../repositories/AttendanceRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { AppError } from '../utils/appError';

export class AttendanceService {
    private attendanceRepository: AttendanceRepository;
    private employeeRepository: EmployeeRepository;

    constructor(
        attendanceRepository: AttendanceRepository,
        employeeRepository: EmployeeRepository
    ) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    async createAttendance(attendanceData: Attendance): Promise<Attendance> {
        // Verify employee exists
        const employee = await this.employeeRepository.getEmployeeById(
            attendanceData.employee_id
        );
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }

        // Normalize and validate date (ensure a Date object is used by repository)
        const dateObj = typeof attendanceData.date === 'string' ? new Date(attendanceData.date) : (attendanceData.date as unknown as Date);
        if (!dateObj || isNaN(dateObj.getTime())) {
            throw new AppError('Invalid date provided', 400);
        }

        // Check if attendance record already exists for that day — upsert behavior
        const existingRecord = await this.attendanceRepository.getAttendanceByEmployeeAndDate(
            attendanceData.employee_id,
            dateObj
        );

        // Validate time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(attendanceData.check_in_time)) {
            throw new AppError('Invalid time format. Use HH:MM format', 400);
        }

        if (existingRecord) {
            await this.attendanceRepository.update(existingRecord.id as number, {
                check_in_time: attendanceData.check_in_time,
                updated_at: new Date(),
            });
            return this.attendanceRepository.getAttendanceById(existingRecord.id as number) as Promise<Attendance>;
        }

        return this.attendanceRepository.create(attendanceData);
    }

    async getAttendanceById(id: number): Promise<Attendance> {
        const attendance = await this.attendanceRepository.getAttendanceById(id);
        if (!attendance) {
            throw new AppError('Attendance record not found', 404);
        }
        return attendance;
    }

    async getAttendanceByEmployeeId(employeeId: number): Promise<Attendance[]> {
        const employee = await this.employeeRepository.getEmployeeById(employeeId);
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }

        return this.attendanceRepository.getAttendanceByEmployeeId(employeeId);
    }

    async getAttendanceByDate(date: Date): Promise<Attendance[]> {
        return this.attendanceRepository.getAttendanceByDate(date);
    }

    async updateAttendance(
        id: number,
        attendanceData: Partial<Attendance>
    ): Promise<Attendance> {
        const attendance = await this.attendanceRepository.getAttendanceById(id);
        if (!attendance) {
            throw new AppError('Attendance record not found', 404);
        }

        // Validate time format if provided
        if (attendanceData.check_in_time) {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(attendanceData.check_in_time)) {
                throw new AppError(
                    'Invalid time format. Use HH:MM format',
                    400
                );
            }
        }

        await this.attendanceRepository.update(id, attendanceData);
        return this.getAttendanceById(id);
    }

    async deleteAttendance(id: number): Promise<void> {
        const attendance = await this.attendanceRepository.getAttendanceById(id);
        if (!attendance) {
            throw new AppError('Attendance record not found', 404);
        }

        await this.attendanceRepository.delete(id);
    }

    async getAttendanceReport(
        startDate: Date,
        endDate: Date
    ): Promise<Attendance[]> {
        return this.attendanceRepository.getAttendanceRange(startDate, endDate);
    }

    async listAttendance(filters: {
        employee_id?: number;
        date?: Date | string;
        from?: Date | string;
        to?: Date | string;
        include_absent?: boolean;
    }): Promise<any[]> {
        // If caller requested to include absent employees for a single date,
        // return the left-joined employees + attendance rows. Otherwise
        // return normal attendance rows filtered by the provided filters.
        if (
            filters.date &&
            filters.employee_id === undefined &&
            !filters.from &&
            !filters.to &&
            filters.include_absent
        ) {
            const dateObj = typeof filters.date === 'string' ? new Date(filters.date) : (filters.date as Date);
            if (isNaN(dateObj.getTime())) {
                throw new AppError('Invalid date provided', 400);
            }
            return this.attendanceRepository.listForDateAllEmployees(dateObj);
        }

        return this.attendanceRepository.list(filters) as Promise<any[]>;
    }
}

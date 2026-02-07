import { Attendance } from '../models/types';
import { AttendanceRepository } from '../repositories/AttendanceRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';

export interface AttendanceSummaryRow {
    employee_id: number;
    name: string;
    days_present: number;
    times_late: number;
}

export class ReportsService {
    private attendanceRepository: AttendanceRepository;
    private employeeRepository: EmployeeRepository;

    constructor(attendanceRepository: AttendanceRepository, employeeRepository: EmployeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    async getMonthlyAttendanceSummary(month: string, employeeId?: number | undefined): Promise<AttendanceSummaryRow[]> {
        // month format: YYYY-MM
        const [year, mon] = month.split('-').map(Number);
        const startDate = new Date(year, mon - 1, 1);
        const endDate = new Date(year, mon, 0); // last day of month

        const attendances = await this.attendanceRepository.getAttendanceRange(startDate, endDate);
        const employees = await this.employeeRepository.getAllEmployees();

        const filtered = attendances.filter((a: Attendance) => {
            if (employeeId && a.employee_id !== employeeId) return false;
            return true;
        });

        const grouped = new Map<number, Attendance[]>();
        for (const a of filtered) {
            const list = grouped.get(a.employee_id) || [];
            list.push(a);
            grouped.set(a.employee_id, list);
        }

        const rows: AttendanceSummaryRow[] = [];
        for (const [empId, list] of grouped.entries()) {
            const employee = employees.find((e) => e.id === empId);
            const uniqueDates = new Set(list.map((l) => {
                const d = typeof l.date === 'string' ? new Date(l.date) : (l.date as Date);
                return isNaN(d.getTime()) ? String(l.date) : d.toISOString().split('T')[0];
            }));
            const days_present = uniqueDates.size;
            // count times late: check_in_time > 09:45:00
            const times_late = list.reduce((acc, cur) => {
                const t = (cur as any).check_in_time || '';
                // normalize to HH:MM:SS
                const parts = String(t).split(':');
                const hh = parts[0] ? parts[0].padStart(2, '0') : '00';
                const mm = parts[1] ? parts[1].padStart(2, '0') : '00';
                const ss = parts[2] ? parts[2].padStart(2, '0') : '00';
                const norm = `${hh}:${mm}:${ss}`;
                return acc + (norm > '09:45:00' ? 1 : 0);
            }, 0);
            rows.push({
                employee_id: empId,
                name: employee ? employee.name : 'Unknown',
                days_present,
                times_late,
            });
        }

        return rows;
    }
}

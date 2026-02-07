import { Router, Request, Response, NextFunction } from 'express';
import { Knex } from 'knex';
import authenticate from '../middleware/auth';
import { AttendanceRepository } from '../repositories/AttendanceRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { ReportsService } from '../services/ReportsService';

export const createReportsRoutes = (knex: Knex): Router => {
    const router = Router();

    router.use(authenticate);

    const attendanceRepository = new AttendanceRepository(knex);
    const employeeRepository = new EmployeeRepository(knex);
    const reportsService = new ReportsService(attendanceRepository, employeeRepository);

    router.get('/reports/attendance', async (req: Request, res: Response, next: NextFunction) => {
        try {
            let { month, employee_id } = req.query as any;
            if (!month) {
                return res.status(400).json({ success: false, message: 'month query required in YYYY-MM format' });
            }

            // Accept YYYY-MM or YYYY-MM-DD or ISO datetime — normalize to YYYY-MM
            if (typeof month === 'string') {
                month = month.trim();
                if (/^\d{4}-\d{2}-\d{2}$/.test(month)) {
                    month = month.slice(0, 7);
                } else if (/^\d{4}-\d{2}$/.test(month)) {
                    // already YYYY-MM
                } else {
                    // try parsing as date and extract year-month
                    const d = new Date(month);
                    if (!isNaN(d.getTime())) {
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, '0');
                        month = `${y}-${m}`;
                    }
                }
            }

            if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
                return res.status(400).json({ success: false, message: 'month query required in YYYY-MM format' });
            }

            const employeeId = employee_id !== undefined ? Number(employee_id) : undefined;

            let rows;
            if (employeeId !== undefined) {
                rows = await reportsService.getMonthlyAttendanceSummary(month, employeeId);
            } else {
                rows = await reportsService.getMonthlyAttendanceSummary(month);
            }
            res.status(200).json({ success: true, message: `Attendance summary for ${month}`, data: rows });
        } catch (err) {
            next(err);
        }
    });

    return router;
};

import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/AttendanceService';
import { logger } from '../utils/logger';

export class AttendanceController {
    private attendanceService: AttendanceService;

    constructor(attendanceService: AttendanceService) {
        this.attendanceService = attendanceService;
    }

    async createAttendance(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const attendance = await this.attendanceService.createAttendance(
                req.body
            );
            logger.info('Attendance recorded successfully', {
                attendanceId: attendance.id,
            });
            res.status(201).json({
                success: true,
                message: 'Attendance recorded successfully',
                data: attendance,
            });
        } catch (error) {
            next(error);
        }
    }

    async listAttendance(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { employee_id, date, from, to } = req.query as Record<string, any>;

            // Validate employee_id
            if (employee_id !== undefined && String(employee_id).length > 0) {
                if (isNaN(Number(employee_id))) {
                    res.status(400).json({ success: false, message: 'employee_id must be a number', data: [] });
                    return;
                }
            }

            // If filtering by employee_id, require both from and to range
            if (employee_id !== undefined && String(employee_id).length > 0) {
                if (!from || !to) {
                    res.status(400).json({ success: false, message: 'When filtering by employee_id, both from and to dates are required', data: [] });
                    return;
                }
            }

            // Validate dates
            const dateVals = { date, from, to };
            for (const [k, v] of Object.entries(dateVals)) {
                if (v !== undefined && String(v).length > 0) {
                    const d = new Date(String(v));
                    if (isNaN(d.getTime())) {
                        res.status(400).json({ success: false, message: `${k} must be a valid date`, data: [] });
                        return;
                    }
                }
            }

            const filters: any = {};
            if (employee_id !== undefined && String(employee_id).length > 0) filters.employee_id = Number(employee_id);
            if (date) filters.date = String(date);
            if (from) filters.from = String(from);
            if (to) filters.to = String(to);

            const rows = await this.attendanceService.listAttendance(filters);

            const data = rows.map((r) => ({
                id: r.id,
                employee_id: r.employee_id,
                date: (r.date instanceof Date ? r.date.toISOString().split('T')[0] : String(r.date)),
                check_in: (r as any).check_in_time ?? (r as any).check_in ?? null,
                check_out: (r as any).check_out_time ?? (r as any).check_out ?? null,
                created_at: r.created_at,
                updated_at: r.updated_at,
            }));

            res.status(200).json({ success: true, message: 'Attendance retrieved successfully', data });
        } catch (error) {
            next(error);
        }
    }

    async getAttendanceById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const attendance = await this.attendanceService.getAttendanceById(
                Number(id)
            );
            res.status(200).json({
                success: true,
                message: 'Attendance retrieved successfully',
                data: attendance,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAttendanceByEmployeeId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { employeeId } = req.params;
            const attendance = await this.attendanceService.getAttendanceByEmployeeId(
                Number(employeeId)
            );
            res.status(200).json({
                success: true,
                message: 'Attendance records retrieved successfully',
                data: attendance,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAttendanceByDate(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { date } = req.query;
            if (!date || typeof date !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Date query parameter is required',
                });
                return;
            }

            const attendance = await this.attendanceService.getAttendanceByDate(
                new Date(date)
            );
            res.status(200).json({
                success: true,
                message: `Attendance records for ${date}`,
                data: attendance,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAttendance(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const attendance = await this.attendanceService.updateAttendance(
                Number(id),
                req.body
            );
            logger.info('Attendance updated successfully', { attendanceId: id });
            res.status(200).json({
                success: true,
                message: 'Attendance updated successfully',
                data: attendance,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAttendance(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            await this.attendanceService.deleteAttendance(Number(id));
            logger.info('Attendance deleted successfully', { attendanceId: id });
            res.status(200).json({
                success: true,
                message: 'Attendance deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async getAttendanceReport(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                res.status(400).json({
                    success: false,
                    message:
                        'Both startDate and endDate query parameters are required',
                });
                return;
            }

            const attendance = await this.attendanceService.getAttendanceReport(
                new Date(startDate as string),
                new Date(endDate as string)
            );
            res.status(200).json({
                success: true,
                message: `Attendance report from ${startDate} to ${endDate}`,
                data: attendance,
            });
        } catch (error) {
            next(error);
        }
    }
}

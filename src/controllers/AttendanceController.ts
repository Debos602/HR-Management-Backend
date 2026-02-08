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
            const { employee_id, date, from, to, include_absent } = req.query as Record<string, any>;

            // employee_id validation
            if (employee_id && isNaN(Number(employee_id))) {
                res.status(400).json({
                    success: false,
                    message: 'employee_id must be a number',
                    data: []
                });
                return;
            }

            // date validation
            const validateDate = (value: any, field: string) => {
                if (value) {
                    const d = new Date(String(value));
                    if (isNaN(d.getTime())) {
                        res.status(400).json({
                            success: false,
                            message: `${field} must be a valid date`,
                            data: []
                        });
                        return false;
                    }
                }
                return true;
            };

            if (!validateDate(date, 'date')) return;
            if (!validateDate(from, 'from')) return;
            if (!validateDate(to, 'to')) return;

            const filters: any = {};

            if (employee_id) filters.employee_id = Number(employee_id);
            if (date) filters.date = String(date);
            if (from) filters.from = String(from);
            if (to) filters.to = String(to);
            // support include_absent=true to return all employees for a date with attendance if any
            if (include_absent === 'true' || include_absent === '1' || include_absent === true) {
                filters.include_absent = true;
            }

            const rows = await this.attendanceService.listAttendance(filters);

            const requestedDate = date ? String(date) : null;

            const data = rows.map((r) => ({
                id: r.id ?? null,
                employee_id: r.employee_id,
                employee_name: r.employee_name ?? null,
                date: r.date ?? requestedDate,
                check_in: r.check_in_time ?? null,
                status: r.check_in_time ? 'present' : 'absent',
                created_at: r.created_at ?? null,
                updated_at: r.updated_at ?? null,
            }));

            res.status(200).json({
                success: true,
                message: 'Attendance retrieved successfully',
                data
            });

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

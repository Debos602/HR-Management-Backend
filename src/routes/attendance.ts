import { Router } from 'express';
import { Knex } from 'knex';
import authenticate from '../middleware/auth';
import { AttendanceController } from '../controllers/AttendanceController';
import { AttendanceRepository } from '../repositories/AttendanceRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { AttendanceService } from '../services/AttendanceService';
import { validateRequest } from '../middleware/validation';
import { createAttendanceSchema, updateAttendanceSchema } from '../validation/attendanceValidation';

export const createAttendanceRoutes = (knex: Knex): Router => {
    const router = Router();

    const attendanceRepository = new AttendanceRepository(knex);
    const employeeRepository = new EmployeeRepository(knex);
    const attendanceService = new AttendanceService(attendanceRepository, employeeRepository);
    const attendanceController = new AttendanceController(attendanceService);
    router.use(authenticate);

    router.post('/attendance', validateRequest(createAttendanceSchema), (req, res, next) =>
        attendanceController.createAttendance(req, res, next)
    );
    // Date-based listing moved to explicit path to avoid colliding with numeric id route
    // Examples:
    //  - GET /attendance/date/2025-08-12
    //  - GET /attendance/date (no date, same as /attendance)
    router.get('/attendance/date/:date?', (req, res, next) =>
        attendanceController.listAttendance(req, res, next)
    );
    router.get('/attendance/by-date', (req, res, next) =>
        attendanceController.getAttendanceByDate(req, res, next)
    );

    // Constrain id route to digits to prevent collision with other param routes
    router.get('/attendance/:id(\\d+)', (req, res, next) =>
        attendanceController.getAttendanceById(req, res, next)
    );

    router.get('/attendance/employee/:employeeId', (req, res, next) =>
        attendanceController.getAttendanceByEmployeeId(req, res, next)
    );

    router.get('/attendance/report', (req, res, next) =>
        attendanceController.getAttendanceReport(req, res, next)
    );

    router.put('/attendance/:id', validateRequest(updateAttendanceSchema), (req, res, next) =>
        attendanceController.updateAttendance(req, res, next)
    );

    router.delete('/attendance/:id', (req, res, next) =>
        attendanceController.deleteAttendance(req, res, next)
    );

    return router;
};

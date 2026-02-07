import { Router } from 'express';
import { Knex } from 'knex';
import authenticate from '../middleware/auth';
import { EmployeeController } from '../controllers/EmployeeController';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { EmployeeService } from '../services/EmployeeService';
import { validateRequest } from '../middleware/validation';
import { createEmployeeSchema, updateEmployeeSchema } from '../validation/employeeValidation';
import { upload } from '../config/multer';

export const createEmployeeRoutes = (knex: Knex): Router => {
    const router = Router();

    const employeeRepository = new EmployeeRepository(knex);
    const employeeService = new EmployeeService(employeeRepository);
    const employeeController = new EmployeeController(employeeService);

    router.use(authenticate);

    router.post('/employees', upload.single('photo_path'), validateRequest(createEmployeeSchema), (req, res, next) =>
        employeeController.createEmployee(req, res, next)
    );

    router.get('/employees', (req, res, next) =>
        employeeController.getAllEmployees(req, res, next)
    );

    router.get('/employees/search', (req, res, next) =>
        employeeController.searchEmployees(req, res, next)
    );

    router.get('/employees/designation/:designation', (req, res, next) =>
        employeeController.getEmployeesByDesignation(req, res, next)
    );

    router.get('/employees/:id', (req, res, next) =>
        employeeController.getEmployeeById(req, res, next)
    );

    router.put('/employees/:id', upload.single('photo_path'), validateRequest(updateEmployeeSchema), (req, res, next) =>
        employeeController.updateEmployee(req, res, next)
    );

    router.delete('/employees/:id', (req, res, next) =>
        employeeController.deleteEmployee(req, res, next)
    );

    return router;
};

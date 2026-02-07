import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/EmployeeService';
import fs from 'fs';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper';
import { logger } from '../utils/logger';

export class EmployeeController {
    private employeeService: EmployeeService;

    constructor(employeeService: EmployeeService) {
        this.employeeService = employeeService;
    }

    async createEmployee(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const payload: any = { ...req.body };
            if (req.file && req.file.path) {
                const uploaded = await uploadToCloudinary(req.file.path);
                payload.photo_path = uploaded.url;
                // remove temp file
                fs.unlink(req.file.path, () => { });
            }

            const employee = await this.employeeService.createEmployee(payload);
            console.log('Employee created successfully', req.body);
            logger.info('Employee created successfully', { employeeId: employee.id });
            res.status(201).json({
                success: true,
                message: 'Employee created successfully',
                data: employee,
            });
        } catch (error) {
            next(error);
        }
    }

    async getEmployeeById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const employee = await this.employeeService.getEmployeeById(Number(id));
            res.status(200).json({
                success: true,
                message: 'Employee retrieved successfully',
                data: employee,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllEmployees(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const query = req.query as Record<string, any>;
            // support search via ?search=term
            if (query.search && typeof query.search === 'string' && query.search.trim().length > 0) {
                const employees = await this.employeeService.searchEmployees(query.search.trim());
                res.status(200).json({ success: true, message: `Search results for '${query.search}'`, data: employees });
                return;
            }

            const result = await this.employeeService.getAllEmployees(query);
            if ((result as any).data) {
                res.status(200).json({ success: true, message: 'Employees retrieved successfully', data: (result as any).data, meta: (result as any).meta });
            } else {
                res.status(200).json({ success: true, message: 'Employees retrieved successfully', data: result });
            }
        } catch (error) {
            next(error);
        }
    }

    async getEmployeesByDesignation(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { designation } = req.params;
            const employees =
                await this.employeeService.getEmployeesByDesignation(designation);
            res.status(200).json({
                success: true,
                message: `Employees with designation '${designation}' retrieved successfully`,
                data: employees,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateEmployee(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const payload: any = { ...req.body };
            if (req.file && req.file.path) {
                const uploaded = await uploadToCloudinary(req.file.path);
                payload.photo_path = uploaded.url;
                fs.unlink(req.file.path, () => { });
            }

            const employee = await this.employeeService.updateEmployee(Number(id), payload);
            logger.info('Employee updated successfully', { employeeId: employee.id });
            res.status(200).json({
                success: true,
                message: 'Employee updated successfully',
                data: employee,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteEmployee(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            await this.employeeService.deleteEmployee(Number(id));
            logger.info('Employee deleted successfully', { employeeId: id });
            res.status(200).json({
                success: true,
                message: 'Employee deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async searchEmployees(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { q } = req.query;
            if (!q || typeof q !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Search query is required',
                });
                return;
            }

            const employees = await this.employeeService.searchEmployees(q);
            res.status(200).json({
                success: true,
                message: `Search results for '${q}'`,
                data: employees,
            });
        } catch (error) {
            next(error);
        }
    }
}

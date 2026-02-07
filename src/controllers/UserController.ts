import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const payload = { ...req.body } as any;
            if (payload.password) {
                payload.password_hash = await bcrypt.hash(payload.password, 10);
                delete payload.password;
            }
            const user = await this.userService.createUser(payload);
            logger.info('User created successfully', { userId: user.id });
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(Number(id));
            res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            const payload = { ...req.body } as any;
            if (payload.password) {
                payload.password_hash = await bcrypt.hash(payload.password, 10);
                delete payload.password;
            }
            const user = await this.userService.updateUser(Number(id), payload);
            logger.info('User updated successfully', { userId: user.id });
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(Number(id));
            logger.info('User deleted successfully', { userId: id });
            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

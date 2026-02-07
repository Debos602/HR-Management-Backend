import { Router, Request, Response, NextFunction } from 'express';
import { Knex } from 'knex';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production';

export const createAuthRoutes = (knex: Knex): Router => {
    const router = Router();
    const userRepository = new UserRepository(knex);

    router.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new AppError('Email and password required', 400);
            }

            const user = await userRepository.getUserByEmail(email);
            if (!user) {
                throw new AppError('Invalid credentials', 401);
            }

            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) {
                throw new AppError('Invalid credentials', 401);
            }

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });

            res.status(200).json({ success: true, token, data: { id: user.id, email: user.email, name: user.name } });
        } catch (err) {
            next(err);
        }
    });

    return router;
};

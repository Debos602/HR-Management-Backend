import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production';

export interface JwtPayload {
    id: number;
    email: string;
    iat?: number;
    exp?: number;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Missing or invalid Authorization header', 401));
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (req as any).user = decoded;
        return next();
    } catch (err) {
        return next(new AppError('Invalid or expired token', 401));
    }
};

export default authenticate;

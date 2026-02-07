import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';


export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction // declare type even if not used
): void => {
    let error = { ...err };
    error.message = err.message || 'Server Error';
    error.statusCode = err.statusCode || 500;

    // Log error
    logger.error(`${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method}`);

    // Knex/SQL errors
    if (err.code) {
        if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
            error = new AppError('Duplicate field value. Please use another value.', 400);
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === '23503') {
            error = new AppError('Foreign key constraint fails.', 400);
        }
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Invalid token. Please log in again', 401);
    }

    if (err.name === 'TokenExpiredError') {
        error = new AppError('Your token has expired. Please log in again', 401);
    }

    // Return response
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from '../utils/appError';

export const validateRequest = (schema: Schema) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errorMessages = error.details
                .map((detail) => detail.message)
                .join(', ');
            throw new AppError(errorMessages, 400);
        }

        req.body = value;
        next();
    };
};

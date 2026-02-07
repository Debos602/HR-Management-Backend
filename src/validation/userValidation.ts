import Joi from 'joi';

export const createUserSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required',
        }),
    name: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters',
            'string.max': 'Name cannot exceed 255 characters',
            'any.required': 'Name is required',
        }),
});

export const updateUserSchema = Joi.object({
    email: Joi.string()
        .email()
        .messages({
            'string.email': 'Please provide a valid email address',
        }),
    password: Joi.string()
        .min(6)
        .messages({
            'string.min': 'Password must be at least 6 characters',
        }),
    name: Joi.string()
        .min(3)
        .max(255)
        .messages({
            'string.min': 'Name must be at least 3 characters',
            'string.max': 'Name cannot exceed 255 characters',
        }),
}).min(1);

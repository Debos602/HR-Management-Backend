import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters',
            'string.max': 'Name cannot exceed 255 characters',
            'any.required': 'Name is required',
        }),
    age: Joi.number()
        .integer()
        .min(18)
        .max(70)
        .required()
        .messages({
            'number.base': 'Age must be a number',
            'number.min': 'Age must be at least 18',
            'number.max': 'Age cannot exceed 70',
            'any.required': 'Age is required',
        }),
    designation: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Designation must be at least 2 characters',
            'string.max': 'Designation cannot exceed 255 characters',
            'any.required': 'Designation is required',
        }),
    hiring_date: Joi.date()
        .required()
        .messages({
            'date.base': 'Hiring date must be a valid date',
            'any.required': 'Hiring date is required',
        }),
    date_of_birth: Joi.date()
        .required()
        .messages({
            'date.base': 'Date of birth must be a valid date',
            'any.required': 'Date of birth is required',
        }),
    salary: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'Salary must be a number',
            'number.positive': 'Salary must be greater than 0',
            'any.required': 'Salary is required',
        }),
    photo_path: Joi.string()
        .optional()
        .messages({
            'string.base': 'Photo path must be a string',
        }),
});

export const updateEmployeeSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .messages({
            'string.min': 'Name must be at least 3 characters',
            'string.max': 'Name cannot exceed 255 characters',
        }),
    age: Joi.number()
        .integer()
        .min(18)
        .max(70)
        .messages({
            'number.base': 'Age must be a number',
            'number.min': 'Age must be at least 18',
            'number.max': 'Age cannot exceed 70',
        }),
    designation: Joi.string()
        .min(2)
        .max(255)
        .messages({
            'string.min': 'Designation must be at least 2 characters',
            'string.max': 'Designation cannot exceed 255 characters',
        }),
    hiring_date: Joi.date()
        .messages({
            'date.base': 'Hiring date must be a valid date',
        }),
    date_of_birth: Joi.date()
        .messages({
            'date.base': 'Date of birth must be a valid date',
        }),
    salary: Joi.number()
        .positive()
        .precision(2)
        .messages({
            'number.base': 'Salary must be a number',
            'number.positive': 'Salary must be greater than 0',
        }),
    photo_path: Joi.string()
        .optional()
        .messages({
            'string.base': 'Photo path must be a string',
        }),
}).min(1);

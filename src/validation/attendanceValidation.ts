import Joi from 'joi';

export const createAttendanceSchema = Joi.object({
    employee_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Employee ID must be a number',
            'number.positive': 'Employee ID must be positive',
            'any.required': 'Employee ID is required',
        }),
    date: Joi.date()
        .required()
        .messages({
            'date.base': 'Date must be a valid date',
            'any.required': 'Date is required',
        }),
    check_in_time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
            'string.pattern.base': 'Check-in time must be in HH:MM format (e.g., 09:30)',
            'any.required': 'Check-in time is required',
        }),
});

export const updateAttendanceSchema = Joi.object({
    employee_id: Joi.number()
        .integer()
        .positive()
        .messages({
            'number.base': 'Employee ID must be a number',
            'number.positive': 'Employee ID must be positive',
        }),
    date: Joi.date()
        .messages({
            'date.base': 'Date must be a valid date',
        }),
    check_in_time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .messages({
            'string.pattern.base': 'Check-in time must be in HH:MM format (e.g., 09:30)',
        }),
}).min(1);

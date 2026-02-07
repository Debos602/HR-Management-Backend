import { Router } from 'express';
import { Knex } from 'knex';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { validateRequest } from '../middleware/validation';
import { createUserSchema, updateUserSchema } from '../validation/userValidation';

export const createUserRoutes = (knex: Knex): Router => {
    const router = Router();

    const userRepository = new UserRepository(knex);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    router.post('/users', validateRequest(createUserSchema), (req, res, next) =>
        userController.createUser(req, res, next)
    );

    router.get('/users', (req, res, next) =>
        userController.getAllUsers(req, res, next)
    );

    router.get('/users/:id', (req, res, next) =>
        userController.getUserById(req, res, next)
    );

    router.put('/users/:id', validateRequest(updateUserSchema), (req, res, next) =>
        userController.updateUser(req, res, next)
    );

    router.delete('/users/:id', (req, res, next) =>
        userController.deleteUser(req, res, next)
    );

    return router;
};

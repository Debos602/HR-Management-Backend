import { Router } from 'express';
import { Knex } from 'knex';
import { createUserRoutes } from './users';
import { createEmployeeRoutes } from './employees';
import { createAttendanceRoutes } from './attendance';
import { createAuthRoutes } from './auth';
import { createReportsRoutes } from './reports';

export const createRoutes = (knex: Knex): Router => {
    const router = Router();

    // Health check
    router.get('/api/health', (_req, res) => {
        res.status(200).json({ success: true, message: 'Server is running' });
    });

    // Compose feature routes
    router.use(createAuthRoutes(knex));
    router.use(createUserRoutes(knex));
    router.use(createEmployeeRoutes(knex));
    router.use(createAttendanceRoutes(knex));
    router.use(createReportsRoutes(knex));

    return router;
};

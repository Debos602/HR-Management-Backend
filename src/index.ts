import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import path from 'path';
import { AppError } from './utils/appError';
import { logger } from './utils/logger';
import { knex } from './databases/setting';
import { createRoutes } from './routes/index';
import { errorHandler } from './middleware/error';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files for uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Routes
app.use(createRoutes(knex));

// 404 handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError('Route not found', 404);
  next(error);
});

// Global error handler
app.use(errorHandler);

// Server startup
app
  .listen(PORT, () => {
    logger.info(`🚀 Server started on http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  })
  .on('error', (err: any) => {
    logger.error('Server error', { error: err.message });
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await knex.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await knex.destroy();
  process.exit(0);
});


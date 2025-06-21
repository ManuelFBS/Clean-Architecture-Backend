import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import logger from '../../shared/logger';
import { stat } from 'fs';

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (err instanceof AppError) {
        logger.error(`AppError: ${err.message}`, {
            statusCode: err.statusCode,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });

        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    logger.error(`Internal Server Error: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}

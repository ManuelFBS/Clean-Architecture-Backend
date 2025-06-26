import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { Logger } from '../../shared/logger';

const logger = new Logger();

export default function ErrorMiddleware(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (err instanceof AppError) {
        logger.error(`AppError: ${err.message}`, {
            statusCode: err.statusCode,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });

        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    logger.error(`Internal Server Error: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}

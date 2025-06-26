"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorMiddleware;
const AppError_1 = require("../../shared/errors/AppError");
const logger_1 = require("../../shared/logger");
const logger = new logger_1.Logger();
function ErrorMiddleware(err, req, res, next) {
    if (err instanceof AppError_1.AppError) {
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const AppError_1 = require("../../shared/errors/AppError");
const logger_1 = __importDefault(require("../../shared/logger"));
function errorMiddleware(err, req, res, next) {
    if (err instanceof AppError_1.AppError) {
        logger_1.default.error(`AppError: ${err.message}`, {
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
    logger_1.default.error(`Internal Server Error: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}

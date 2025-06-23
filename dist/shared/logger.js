"use strict";
/*import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

//~ Configuración básica de formato...
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(
        ({ timestamp, level, message, stack }) => {
            return `${timestamp} [${level}]: ${stack || message}`;
        },
    ),
);

//~ Configuración de transports...
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            logFormat,
        ),
        level: 'debug',
    }),
    new DailyRotateFile({
        filename: path.join(
            'logs',
            'application-%DATE%.log',
        ),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        format: logFormat,
        level: 'info',
    }),
];

//~ Creación del logger...
const logger = winston.createLogger({
    level:
        process.env.NODE_ENV === 'production'
            ? 'info'
            : 'debug',
    transports,
    exceptionHandlers: [
        new DailyRotateFile({
            filename: path.join(
                'logs',
                'exceptions-%DATE%.log',
            ),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
    exitOnError: false, //> ¡Importante para evitar bucles!...
});

//~ Solo para desarrollo...
if (process.env.NODE_ENV === 'development') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
            level: 'debug',
        }),
    );
}

export default logger;
*/
Object.defineProperty(exports, "__esModule", { value: true });
// src/shared/logger.ts
const console_1 = require("console");
const logger = new console_1.Console({
    stdout: process.stdout,
    stderr: process.stderr,
    colorMode: true,
});
exports.default = {
    info: (...args) => logger.log('[INFO]', ...args),
    error: (...args) => logger.error('[ERROR]', ...args),
    warn: (...args) => logger.warn('[WARN]', ...args),
    debug: (...args) => logger.log('[DEBUG]', ...args),
};

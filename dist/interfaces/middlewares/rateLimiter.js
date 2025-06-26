"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("../../shared/logger");
const logger = new logger_1.Logger();
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, //> 15 minutes...
    max: 20, //> limit each IP to 20 requests per windowMs...
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP ${req.ip} on path ${req.path}`);
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true, //> Return rate limit info in the `RateLimit-*` headers...
    legacyHeaders: false, //> Disable the `X-RateLimit-*` headers...
});
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, //> limit each IP to 1000 requests per windowMs...
    message: 'Too many requests from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

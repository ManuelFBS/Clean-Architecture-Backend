import rateLimit from 'express-rate-limit';
import logger from '../../shared/logger';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //> 15 minutes...
    max: 20, //> limit each IP to 20 requests per windowMs...
    message:
        'Too many login attempts from this IP, please try again after 15 minutes',
    handler: (req, res, next, options) => {
        logger.warn(
            `Rate limit exceeded for IP ${req.ip} on path ${req.path}`,
        );
        res.status(options.statusCode).send(
            options.message,
        );
    },
    standardHeaders: true, //> Return rate limit info in the `RateLimit-*` headers...
    legacyHeaders: false, //> Disable the `X-RateLimit-*` headers...
});

export const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, //> limit each IP to 1000 requests per windowMs...
    message:
        'Too many requests from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

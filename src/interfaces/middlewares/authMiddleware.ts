import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Next } from 'mysql2/typings/mysql/lib/parsers/typeCast';

dotenv.config();

export interface AuthenticatedRequest extends Request {
    user?: {
        dni: string;
        user: string;
        role: string;
    };
}

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void {
    const token = req
        .header('Authorization')
        ?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({
            message: 'No token provided',
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
        ) as {
            dni: string;
            username: string;
            role: string;
        };

        req.user = {
            dni: decoded.dni,
            user: decoded.username,
            role: decoded.role,
        };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

export function authorize(roles: string[]) {
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ message: 'Forbidden' });
        }

        next();
    };
}

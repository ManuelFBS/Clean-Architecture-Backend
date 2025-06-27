import { Request, Response, NextFunction } from 'express';
import {
    Permission,
    RolePermissions,
} from '../../core/domain/types/Permission';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
    ForbiddenError,
    UnauthorizedError,
} from '../../shared/errors/AppError';
import { UserRole } from '../../core/domain/entities/User';
import { container } from '../../shared/container';
import { TYPES } from '../../shared/constants/TYPES';
import { TokenService } from '../../core/domain/services/TokenService';

dotenv.config();

//~ Define the user type for type safety...
interface AuthenticatedUser {
    dni: string;
    username: string;
    role: UserRole;
}

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const token = req
            .header('Authorization')
            ?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                message: 'No token provided',
            });
            return;
        }

        //* Verificar si el token está en la blacklist...
        const tokenService = container.get<TokenService>(
            TYPES.TokenService,
        );
        const isInvalid =
            await tokenService.isTokenInvalid(token);

        if (isInvalid) {
            res.status(401).json({
                message: 'Token has been invalidated',
            });
            return;
        }

        //* Verificar el token con JWT...
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
        ) as {
            dni: string;
            username: string;
            role: UserRole;
        };

        //* Use type assertion to add user property...
        (req as any).user = {
            dni: decoded.dni,
            username: decoded.username,
            role: decoded.role,
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

export function authorize(
    permissions: Permission | Permission[],
) {
    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        //* Use type assertion to access user property...
        const user = (req as any).user as
            | AuthenticatedUser
            | undefined;

        if (!user) {
            throw new UnauthorizedError(
                'Authentication required...',
            );
        }

        const requiredPermissions = Array.isArray(
            permissions,
        )
            ? permissions
            : [permissions];

        const userPermissions =
            RolePermissions[user.role as UserRole] || [];

        const hasPermission = requiredPermissions.every(
            (permission) =>
                userPermissions.includes(permission),
        );

        if (!hasPermission) {
            throw new ForbiddenError(
                'Insufficient permissions...',
            );
        }

        next();
    };
}

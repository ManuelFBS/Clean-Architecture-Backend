import {
    hasPermission,
    Permission,
} from '../../core/domain/types/Permission';
import { Request, Response } from 'express';
import { UserUseCases } from '../../core/usecases/user/UserUseCases';
import {
    CreateUserDTO,
    UpdateUserDTO,
    LoginDTO,
} from '../dtos/UserDTO';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import {
    authenticate,
    authorize,
} from '../middlewares/authMiddleware';
import { container } from '../../shared/container';
import logger from '../../shared/logger';
import {
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from '../../shared/errors/AppError';

export class UserController {
    private userUseCases: UserUseCases;

    constructor() {
        this.userUseCases = container.get(UserUseCases);
    }

    async login(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const loginData = new LoginDTO();
            Object.assign(loginData, req.body);

            const { token, user } =
                await this.userUseCases.login(
                    loginData.username,
                    loginData.password,
                );

            logger.info(`User logged in: ${user.username}`);
            res.status(200).json({ token, user });
        } catch (error: any) {
            logger.error(`Login failed: ${error.message}`);
            res.status(error.statusCode || 401).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async createUser(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            //> 1. Verificación segura del usuario autenticado...
            if (!req.user) {
                throw new UnauthorizedError(
                    'Authentication required',
                );
            }

            //> 2. Verificación de permisos con seguridad de tipos...
            if (
                !hasPermission(req.user.role, 'user:create')
            ) {
                throw new ForbiddenError(
                    'Insufficient permissions',
                );
            }

            const userData = new CreateUserDTO();
            Object.assign(userData, req.body);

            //> Validación adicional para creación de Owners...
            if (
                userData.role === 'Owner' &&
                req.user.role !== 'Owner'
            ) {
                throw new ForbiddenError(
                    'Only Owners can create other Owners...',
                );
            }

            //> Convertir DTO a formato de dominio (sin hash aún)...
            const userParams = userData.toDomain();

            const newUser =
                await this.userUseCases.createUser(
                    userParams,
                );

            logger.info(
                `User created: ${newUser.username}`,
            );

            res.status(201).json({
                dni: newUser.dni,
                username: newUser.username,
                role: newUser.role,
                createdAt: newUser.createdAt,
            });
        } catch (error: any) {
            logger.error(
                `Error creating user: ${error.message}`,
            );
            res.status(error.statusCode || 400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async updateUser(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { dni } = req.params;
            const updateData = new UpdateUserDTO();
            Object.assign(updateData, req.body);

            const updatedUser =
                await this.userUseCases.updateUser(
                    dni,
                    updateData,
                );

            logger.info(
                `User updated: ${updatedUser.username}`,
            );
            res.status(200).json(updatedUser);
        } catch (error: any) {
            logger.error(
                `Error updating user: ${error.message}`,
            );
            res.status(error.statusCode || 400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async deleteUser(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { dni } = req.params;
            await this.userUseCases.deleteUser(dni);

            logger.info(`User deleted: ${dni}`);
            res.status(204).send();
        } catch (error: any) {
            logger.error(
                `Error deleting user: ${error.message}`,
            );
            res.status(error.statusCode || 400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async getUserByDNI(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { dni } = req.params;
            const user =
                await this.userUseCases.getUserByDNI(dni);

            if (!user) {
                throw new NotFoundError('User not found');
            }

            res.status(200).json(user);
        } catch (error: any) {
            logger.error(
                `Error getting user: ${error.message}`,
            );
            res.status(error.statusCode || 400).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}

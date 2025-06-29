import { injectable, inject } from 'inversify';
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
    LoginResponseDTO,
} from '../dtos/UserDTO';
import { Logger } from '../../shared/logger';
import {
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from '../../shared/errors/AppError';
import { TYPES } from '../../shared/constants/TYPES';
import { AuthenticatedRequest } from '../types';

@injectable()
export class UserController {
    constructor(
        @inject(TYPES.Logger) private logger: Logger,
        @inject(UserUseCases)
        private userUseCases: UserUseCases,
    ) {}

    async login(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const loginData = new LoginDTO();
            Object.assign(loginData, req.body);

            //* Obtener información del cliente...
            const ipAddress =
                req.ip ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress;
            const userAgent = req.get('User-Agent');

            const { token, user } =
                await this.userUseCases.login(
                    loginData.username,
                    loginData.password,
                    ipAddress,
                    userAgent,
                );

            this.logger.info(
                `User logged in: ${user.username} from IP: ${ipAddress}`,
            );

            //* Devolver solo la información segura del usuario (sin password)
            const loginResponse = new LoginResponseDTO({
                dni: user.dni,
                username: user.username,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                employee: user.employee,
            });

            res.status(200).json({
                token,
                user: loginResponse,
            });
        } catch (error: any) {
            this.logger.error(
                `Login failed: ${error.message}`,
            );
            res.status(error.statusCode || 401).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async logout(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            // Obtener el token del header Authorization
            const token = req
                .header('Authorization')
                ?.replace('Bearer ', '');

            if (!token) {
                throw new UnauthorizedError(
                    'No token provided',
                );
            }

            //* Obtener información del cliente...
            const ipAddress =
                req.ip ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress;
            const userAgent = req.get('User-Agent');

            //* Ejecutar el logout...
            await this.userUseCases.logout(
                token,
                ipAddress,
                userAgent,
            );

            this.logger.info(
                'User logged out successfully',
            );

            res.status(200).json({
                status: 'success',
                message: 'Logged out successfully',
            });
        } catch (error: any) {
            this.logger.error(
                `Logout failed: ${error.message}`,
            );
            res.status(error.statusCode || 400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async checkAuth(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const token = req
                .header('Authorization')
                ?.replace('Bearer ', '');

            if (!token) {
                throw new UnauthorizedError(
                    'No token provided',
                );
            }

            const isValid =
                await this.userUseCases.validateToken(
                    token,
                );

            if (!isValid) {
                throw new UnauthorizedError(
                    'Invalid or expired token',
                );
            }

            //* Decodificar el token para obtener información del usuario...
            const jwt = require('jsonwebtoken');
            const decoded = jwt.decode(token);

            res.status(200).json({
                status: 'success',
                authenticated: true,
                user: {
                    dni: decoded.dni,
                    username: decoded.username,
                    role: decoded.role,
                },
            });
        } catch (error: any) {
            this.logger.error(
                `Auth check failed: ${error.message}`,
            );
            res.status(error.statusCode || 401).json({
                status: 'error',
                authenticated: false,
                message: error.message,
            });
        }
    }

    async createUser(
        req: AuthenticatedRequest,
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

            this.logger.info(
                `User created: ${newUser.username}`,
            );

            res.status(201).json({
                dni: newUser.dni,
                username: newUser.username,
                role: newUser.role,
                createdAt: newUser.createdAt,
            });
        } catch (error: any) {
            this.logger.error(
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

            this.logger.info(
                `User updated: ${updatedUser.username}`,
            );
            res.status(200).json(updatedUser);
        } catch (error: any) {
            this.logger.error(
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

            this.logger.info(`User deleted: ${dni}`);
            res.status(204).send();
        } catch (error: any) {
            this.logger.error(
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
            this.logger.error(
                `Error getting user: ${error.message}`,
            );
            res.status(error.statusCode || 400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async getAllUsers(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const users =
                await this.userUseCases.getAllUsers();

            const allUsers = {
                users: users.map((user) => ({
                    dni: user.dni,
                    username: user.username,
                    role: user.role,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                })),
            };

            res.status(200).json(allUsers);
        } catch (error: any) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

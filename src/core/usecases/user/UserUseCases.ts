import { injectable, inject } from 'inversify';
import {
    User,
    UserCreateParams,
} from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';
import { TokenService } from '../../domain/services/TokenService';
import { EmailService } from '../../domain/services/EmailService';
import {
    BadRequestError,
    NotFoundError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
} from '../../../shared/errors/AppError';
import { TYPES } from '../../../shared/constants/TYPES';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

//* Interfaz para la respuesta segura del login (sin password)
interface LoginResponse {
    token: string;
    user: {
        dni: string;
        username: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        employee?: any;
    };
}

@injectable()
export class UserUseCases {
    constructor(
        @inject(TYPES.UserRepository)
        private userRepository: UserRepository,
        @inject(TYPES.EmailService)
        private emailService: EmailService,
        @inject(TYPES.EmployeeRepository)
        private employeeRepository: EmployeeRepository,
        @inject(TYPES.TokenService)
        private tokenService: TokenService,
    ) {}

    async login(
        username: string,
        password: string,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<LoginResponse> {
        const user =
            await this.userRepository.findByUsername(
                username,
            );

        console.log('Usuario encontrado:', user);

        if (!user) {
            throw new UnauthorizedError(
                'Invalid credentials',
            );
        }

        const isValidPassword =
            await user.validatePassword(password);

        console.log('¿Contraseña válida?', isValidPassword);

        if (!isValidPassword) {
            throw new UnauthorizedError(
                'Invalid credentials',
            );
        }

        const employee =
            await this.employeeRepository.findByDNI(
                user.dni,
            );

        if (employee && !employee.emailVerified) {
            throw new ForbiddenError('Email not verified');
        }

        //* Se registra el login exitoso...
        await this.userRepository.logUserLogin(
            user.dni,
            new Date(),
            ipAddress,
            userAgent,
        );

        const token = jwt.sign(
            {
                dni: user.dni,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET || 'default_secret',
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || '2h',
            } as SignOptions,
        );

        //* Crear un objeto usuario sin el password para la respuesta
        const { password: _, ...userWithoutPassword } =
            user;

        return {
            token,
            user: {
                ...userWithoutPassword,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                employee: employee,
            },
        };
    }

    async logout(
        token: string,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<void> {
        try {
            //* Decodificar el token para obtener información del usuario...
            const jwt = require('jsonwebtoken');
            const decoded = jwt.decode(token) as {
                dni: string;
                username: string;
                role: string;
                exp: number;
            };

            if (!decoded || !decoded.dni) {
                throw new UnauthorizedError(
                    'Invalid token',
                );
            }

            //* Invalidar el token (agregarlo a la blacklist)...
            await this.tokenService.invalidateToken(token);

            //* Registrar el logout en el repositorio...
            await this.userRepository.logUserLogout(
                decoded.dni,
                new Date(),
                ipAddress,
                userAgent,
            );

            //* Log del evento...
            console.log(
                `User logged out: ${decoded.username}`,
            );
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }

    //* Método para verificar si un token es válido...
    async validateToken(token: string): Promise<boolean> {
        try {
            //* Verificar si el token está en la blacklist...
            const isInvalid =
                await this.tokenService.isTokenInvalid(
                    token,
                );
            if (isInvalid) {
                return false;
            }

            //* Verificar que el token sea válido con JWT...
            const jwt = require('jsonwebtoken');
            jwt.verify(
                token,
                process.env.JWT_SECRET || 'default_secret',
            );

            return true;
        } catch (error) {
            return false;
        }
    }

    async createUser(
        userData: UserCreateParams,
    ): Promise<User> {
        //* Validar que el empleado exista...
        const employee =
            await this.employeeRepository.findByDNI(
                userData.dni,
            );
        if (!employee) {
            throw new NotFoundError('Employee not found');
        }

        //* Validar username único...
        const existingUser =
            await this.userRepository.findByUsername(
                userData.username,
            );
        if (existingUser) {
            throw new ConflictError(
                'Username already exists',
            );
        }

        //* Validar que no exista otro usuario con el mismo DNI...
        const existingUserByDNI =
            await this.userRepository.findByDNI(
                userData.dni,
            );
        if (existingUserByDNI) {
            throw new ConflictError(
                'User already exists for this employee',
            );
        }

        //* Validar que solo haya un Owner...
        if (userData.role === 'Owner') {
            const adminCount =
                await this.userRepository.countAdmins();
            if (adminCount > 0) {
                throw new BadRequestError(
                    'There can only be one Owner',
                );
            }
        }

        const user = await User.create(userData);
        return this.userRepository.create(user);
    }

    async updateUser(
        dni: string,
        userData: Partial<User>,
    ): Promise<User> {
        const existingUser =
            await this.userRepository.findByDNI(dni);
        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        //* Validar username único si se está cambiando...
        if (
            userData.username &&
            userData.username !== existingUser.username
        ) {
            const userWithSameUsername =
                await this.userRepository.findByUsername(
                    userData.username,
                );
            if (userWithSameUsername) {
                throw new ConflictError(
                    'Username already taken',
                );
            }
        }

        //* Validar que no se cambie el rol a Owner si ya existe uno...
        if (userData.role === 'Owner') {
            const adminCount =
                await this.userRepository.countAdmins();
            if (
                adminCount > 0 &&
                existingUser.role !== 'Owner'
            ) {
                throw new BadRequestError(
                    'There can only be one Owner',
                );
            }
        }

        return this.userRepository.update(dni, userData);
    }

    async deleteUser(dni: string): Promise<void> {
        const user =
            await this.userRepository.findByDNI(dni);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.role === 'Owner') {
            throw new ForbiddenError(
                'Cannot delete Owner user',
            );
        }

        return this.userRepository.delete(dni);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async getUserByDNI(dni: string): Promise<User | null> {
        return this.userRepository.findByDNI(dni);
    }
}

import {
    User,
    UserCreateParams,
} from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';
import { EmailService } from '../../domain/services/EmailService';
import {
    BadRequestError,
    NotFoundError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
} from '../../../shared/errors/AppError';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class UserUseCases {
    constructor(
        private userRepository: UserRepository,
        private emailService: EmailService,
        private employeeRepository: EmployeeRepository,
    ) {}

    async login(
        username: string,
        password: string,
    ): Promise<{ token: string; user: User }> {
        const user =
            await this.userRepository.findByUsername(
                username,
            );
        if (!user) {
            throw new UnauthorizedError(
                'Invalid credentials',
            );
        }

        const isValidPassword =
            await user.validatePassword(password);
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

        return { token, user };
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

        // return this.userRepository.create(userData);
        return User.create(userData);
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

        //* Validar username único si se está cambiando
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

        // Validar que no se cambie el rol a Owner si ya existe uno
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

    async getUserByDNI(dni: string): Promise<User | null> {
        return this.userRepository.findByDNI(dni);
    }

    /*
    async sendVerificationEmail(
        dni: string,
    ): Promise<void> {
        const user =
            await this.userRepository.findByDNI(dni);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const employee =
            await this.employeeRepository.findByDNI(dni);
        if (!employee) {
            throw new NotFoundError('Employee not found');
        }

        if (employee.emailVerified) {
            throw new ConflictError(
                'Email already verified',
            );
        }

        const token = jwt.sign(
            { dni, email: employee.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' },
        );

        await this.emailService.sendVerificationEmail(
            employee.email,
            token,
        );
    }

    async verifyEmail(token: string): Promise<void> {
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string,
            ) as {
                dni: string;
                email: string;
            };

            const employee =
                await this.employeeRepository.findByDNI(
                    decoded.dni,
                );
            if (!employee) {
                throw new NotFoundError(
                    'Employee not found',
                );
            }

            if (employee.email !== decoded.email) {
                throw new BadRequestError(
                    'Email does not match',
                );
            }

            await this.employeeRepository.updateEmailVerification(
                decoded.dni,
                true,
            );
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new BadRequestError(
                    'Verification token expired',
                );
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new BadRequestError(
                    'Invalid verification token',
                );
            }
            throw error;
        }
    }
    */
}

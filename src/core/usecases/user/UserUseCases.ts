import { User, UserRole } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';
import { EmailService } from '../../domain/services/EmailService';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '../../../shared/errors/AppError';

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
            throw new Error('User not found...!');
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new Error('Invalid password...!');
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

    async createUser(user: User): Promise<User> {
        const existingUser =
            await this.userRepository.findByUsername(
                user.username,
            );
        if (existingUser) {
            throw new Error('Username already exists...!');
        }

        const existingUserByDNI =
            await this.userRepository.findByDNI(user.dni);
        if (existingUserByDNI) {
            throw new Error(
                'User with this DNI already exists...!',
            );
        }

        return this.userRepository.create(user);
    }

    async updateUser(
        dni: string,
        user: Partial<User>,
    ): Promise<User> {
        if (user.username) {
            const existingUser =
                await this.userRepository.findByUsername(
                    user.username,
                );
            if (existingUser && existingUser.dni !== dni) {
                throw new Error('Username already exists');
            }
        }
        return this.userRepository.update(dni, user);
    }

    async deleteUser(dni: string): Promise<void> {
        return this.userRepository.delete(dni);
    }

    async getUserByDNI(dni: string): Promise<User | null> {
        return this.userRepository.findByDNI(dni);
    }

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
}

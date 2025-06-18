import { User, UserRole } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class UserUseCases {
    constructor(private userRepository: UserRepository) {}

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
}

import { UserRole } from '../../core/domain/entities/User';

export interface CreateUserDTO {
    dni: string;
    username: string;
    password: string;
    role: UserRole;
}

export interface UpdateUserDTO {
    username?: string;
    password?: string;
    role?: UserRole;
}

export interface LoginDTO {
    username: string;
    password: string;
}

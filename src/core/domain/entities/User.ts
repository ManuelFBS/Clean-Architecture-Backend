import { Employee } from './Employee';
import bcrypt from 'bcrypt';

export const UserRoles = [
    'Owner',
    'Admin',
    'Employee',
] as const;
export type UserRole = (typeof UserRoles)[number];

export interface IUser {
    dni: string;
    username: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
    employee?: Employee;
}

export class User {
    constructor(
        public readonly dni: string,
        public readonly username: string,
        public readonly password: string, // Contiene el hash
        public readonly role: UserRole,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date(),
        public readonly employee?: Employee,
    ) {}

    public static async create(
        userData: Omit<IUser, 'createdAt' | 'updatedAt'>,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(
            userData.password,
            10,
        );
        return new User(
            userData.dni,
            userData.username,
            hashedPassword,
            userData.role,
            new Date(),
            new Date(),
            userData.employee,
        );
    }

    //* Método para validar contraseña...
    public async validatePassword(
        password: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

//~ Tipo para datos de creación de usuario...
export type UserCreateParams = Omit<
    IUser,
    'createdAt' | 'updatedAt'
>;

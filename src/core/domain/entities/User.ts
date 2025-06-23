import { Employee } from './Employee';
import bcrypt from 'bcrypt';

export type UserRole = 'Owner' | 'Admin' | 'Employee';

// export class User {
//     constructor(
//         public dni: string,
//         public username: string,
//         public password: string,
//         public role: UserRole,
//         public createdAt: Date = new Date(),
//         public updatedAt: Date = new Date(),
//         public employee?: Employee,
//     ) {}

//     static create(
//         userData: Omit<User, 'createdAt' | 'updatedAt'>,
//     ): User {
//         return new User(
//             userData.dni,
//             userData.username,
//             userData.password,
//             userData.role,
//             new Date(),
//             new Date(),
//             userData.employee,
//         );
//     }

//     public validatePassword(
//         password: string,
//     ): Promise<boolean> {
//         return bcrypt.compare(password, this.password);
//     }
// }

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

import { Employee } from './Employee';

export type UserRole = 'Owner' | 'Admin' | 'Employee';

export class User {
    constructor(
        public dni: string,
        public username: string,
        public password: string,
        public role: UserRole,
        public employee?: Employee,
    ) {}
}

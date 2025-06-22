import { User } from './User';

export class Employee {
    constructor(
        public id: number,
        public dni: string,
        public name: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public emailVerified: boolean = false,
        public createdAt: Date,
        public updatedAt: Date,
        public user?: User,
    ) {}

    //* Método para verificar el email...
    verifyEmail(): void {
        this.emailVerified = true;
        this.updatedAt = new Date();
    }
}

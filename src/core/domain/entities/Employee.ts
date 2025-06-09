import { User } from './User';

export class Employee {
    constructor(
        public id: number,
        public dni: string,
        public name: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public createdAt: Date,
        public updatedAt: Date,
        public user?: User,
    ) {}
}

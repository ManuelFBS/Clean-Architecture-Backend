import { User } from './User';

export class Employee {
    constructor(
        public id: number,
        public dni: string,
        public name: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public emailVerified: boolean,
        public createdAt: Date,
        public updatedAt: Date,
        public user?: User,
    ) {}

    static create(
        employeeData: Omit<
            Employee,
            'id' | 'createdAt' | 'updatedAt'
        >,
    ): Employee {
        return new Employee(
            0, //> ID temporal, será asignado por la base de datos
            employeeData.dni,
            employeeData.name,
            employeeData.lastName,
            employeeData.email,
            employeeData.phone,
            employeeData.emailVerified || false,
            new Date(), //> createdAt
            new Date(), //> updatedAt
            employeeData.user,
        );
    }
}

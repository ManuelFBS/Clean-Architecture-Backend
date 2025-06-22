import { Employee } from '../entities/Employee';

export interface EmployeeRepository {
    findAll(): Promise<Employee[]>;
    findById(id: number): Promise<Employee | null>;
    findByDNI(dni: string): Promise<Employee | null>;
    create(
        employee: Omit<
            Employee,
            | 'id'
            | 'createdAt'
            | 'updatedAt'
            | 'emailVerified'
        >,
    ): Promise<Employee>;
    update(
        id: number,
        employee: Partial<Employee>,
    ): Promise<Employee>;
    updateEmailVerification(
        dni: string,
        verified: boolean,
    ): Promise<void>;
    delete(id: number): Promise<void>;
}

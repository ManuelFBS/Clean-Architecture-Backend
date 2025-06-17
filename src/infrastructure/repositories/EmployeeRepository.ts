import { Employee } from '../../core/domain/entities/Employee';

export interface EmployeeRepository {
    findAll(): Promise<Employee[]>;
    findById(id: number): Promise<Employee | null>;
    findByDNI(dni: string): Promise<Employee | null>;
    create(
        employee: Omit<
            Employee,
            'id' | 'createdAt' | 'updatedAt'
        >,
    ): Promise<Employee>;
    update(
        id: number,
        employee: Partial<Employee>,
    ): Promise<Employee>;
    delete(id: number): Promise<void>;
}

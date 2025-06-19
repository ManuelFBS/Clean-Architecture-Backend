import { promises } from 'dns';
import { Employee } from '../../domain/entities/Employee';
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';

export class EmployeeUseCases {
    constructor(
        private employeeRepository: EmployeeRepository,
    ) {}

    async getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAll();
    }

    async getEmployeeById(
        id: number,
    ): Promise<Employee | null> {
        return this.employeeRepository.findById(id);
    }

    async getEmployeeByDNI(
        dni: string,
    ): Promise<Employee | null> {
        return this.employeeRepository.findByDNI(dni);
    }

    async createEmployee(
        employee: Omit<
            Employee,
            'id' | 'createdAt' | 'updatedAt'
        >,
    ): Promise<Employee> {
        const existingEmployee =
            await this.employeeRepository.findByDNI(
                employee.dni,
            );

        if (existingEmployee) {
            throw new Error(
                'Employee with this DNI already exists',
            );
        }

        return this.employeeRepository.create(employee);
    }

    async updateEmployee(
        id: number,
        employee: Partial<Employee>,
    ): Promise<Employee> {
        return this.employeeRepository.update(id, employee);
    }

    async deleteEmployee(id: number): Promise<void> {
        return this.employeeRepository.delete(id);
    }
}

import { Employee } from '../../core/domain/entities/Employee';
import { EmployeeRepository } from '../../core/domain/repositories/EmployeeRepository';
import { Database } from '../db/database';

export class EmployeeRepositoryImpl
    implements EmployeeRepository
{
    private db: Database;

    constructor() {
        this.db = Database.getInstance();
    }

    async findAll(): Promise<Employee[]> {
        const connection = await this.db.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM employees',
        );
        return rows as Employee[];
    }

    async findById(id: number): Promise<Employee | null> {
        const connection = await this.db.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM employees WHERE id = ?',
            [id],
        );
        const result = rows as Employee[];

        return result.length ? result[0] : null;
    }

    async findByDNI(dni: string): Promise<Employee | null> {
        const connection = await this.db.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM employees WHERE dni = ?',
            [dni],
        );
        const result = rows as Employee[];

        return result.length ? result[0] : null;
    }

    async create(
        employee: Omit<
            Employee,
            'id' | 'createdAt' | 'updatedAt'
        >,
    ): Promise<Employee> {
        const connection = await this.db.getConnection();
        const [result] = await connection.query(
            'INSERT INTO employees (dni, name, lastName, email, phone) VALUES (?, ?, ?, ?, ?)',
            [
                employee.dni,
                employee.name,
                employee.lastName,
                employee.email,
                employee.phone,
            ],
        );
        const insertId = (result as any).insertId;

        return this.findById(insertId) as Promise<Employee>;
    }

    async update(
        id: number,
        employee: Partial<Employee>,
    ): Promise<Employee> {
        const connection = await this.db.getConnection();
        await connection.query(
            'UPDATE employees SET dni = ?, name = ?, lastName = ?, email = ?, phone = ? WHERE id = ?',
            [
                employee.dni,
                employee.name,
                employee.lastName,
                employee.email,
                employee.phone,
                id,
            ],
        );
        return this.findById(id) as Promise<Employee>;
    }

    async delete(id: number): Promise<void> {
        const connection = await this.db.getConnection();
        await connection.query(
            'DELETE FROM employees WHERE id = ?',
            [id],
        );
    }
}

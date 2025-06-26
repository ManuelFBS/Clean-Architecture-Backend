import { Employee } from '../../../../src/core/domain/entities/Employee';
import { User } from '../../../../src/core/domain/entities/User';

describe('Employee Entity', () => {
    it('should create an employee with correct properties using the constructor', () => {
        const now = new Date();
        const user = new User(
            '1000001234',
            'jhwick',
            '1234567890',
            'Admin',
            now,
            now,
        );
        const employee = new Employee(
            1,
            '1000001234',
            'John H.',
            'Wick',
            'johnhwick@example.com',
            '+5804120001234',
            true,
            now,
            now,
            user,
        );

        expect(employee.id).toBe(1);
        expect(employee.dni).toBe('1000001234');
        expect(employee.name).toBe('John H.');
        expect(employee.lastName).toBe('Wick');
        expect(employee.email).toBe(
            'johnhwick@example.com',
        );
        expect(employee.phone).toBe('+5804120001234');
        expect(employee.emailVerified).toBe(true);
        expect(employee.createdAt).toBe(now);
        expect(employee.updatedAt).toBe(now);
        expect(employee.user).toBe(user);
    });
});

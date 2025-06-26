import { EmployeeRepositoryImpl } from '../../../src/infrastructure/repositories/EmployeeRepositoryImpl';
import { Database } from '../../../src/infrastructure/db/database';

jest.mock('../../../src/infrastructure/db/database.ts');

describe('EmployeeRepositoryImpl (unit)', () => {
    let repo: EmployeeRepositoryImpl;
    let mockConnection: any;
    const mockEmployee = {
        id: 1,
        dni: '1234567890',
        name: 'John H.',
        lastName: 'Wick',
        email: 'johnh.wick@example.com',
        phone: '+58-0412-1234567',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeAll(() => {
        mockConnection = {
            query: jest.fn().mockResolvedValue([[]]),
        };
        (Database.getInstance as jest.Mock).mockReturnValue(
            {
                getConnection: jest
                    .fn()
                    .mockResolvedValue(mockConnection),
            },
        );
        repo = new EmployeeRepositoryImpl();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call query on findAll', async () => {
        await repo.findAll();
        expect(mockConnection.query).toHaveBeenCalledWith(
            'SELECT * FROM employees',
        );
    });

    describe('findById', () => {
        it('should call query with correct SQL and parameters', async () => {
            const testId = 1;
            await repo.findById(testId);

            expect(
                mockConnection.query,
            ).toHaveBeenCalledWith(
                'SELECT * FROM employees WHERE id = ?',
                [testId],
            );
        });

        it('should return employee when found', async () => {
            const testId = 1;

            //> Se simula que la consulta devuelve un empleado...
            mockConnection.query.mockResolvedValueOnce([
                [mockEmployee],
            ]);

            const result = await repo.findById(testId);

            expect(result).toEqual(mockEmployee);
        });

        it('should return null when employee not found', async () => {
            const testId = 999;
            // Simulamos que la consulta devuelve un array vacío
            mockConnection.query.mockResolvedValueOnce([
                [],
            ]);

            const result = await repo.findById(testId);

            expect(result).toBeNull();
        });

        it('should handle database errors', async () => {
            const testId = 1;
            const errorMessage = 'Database error';
            //> Simulamos un error en la consulta...
            mockConnection.query.mockRejectedValueOnce(
                new Error(errorMessage),
            );

            await expect(
                repo.findById(testId),
            ).rejects.toThrow(errorMessage);
        });
    });
});

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
    const mockUpdateData = {
        dni: '0987654321',
        name: 'John H. -Updated-',
        lastName: 'Wick -Updated-',
        email: 'updated.johnh.wick@example.com',
        phone: '+58-0412-7654321',
        emailVerified: false,
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

    describe('findByDNI', () => {
        it('should call query with correct SQL and parameters', async () => {
            const testDNI = '1234567890';

            await repo.findByDNI(testDNI);

            expect(
                mockConnection.query,
            ).toHaveBeenCalledWith(
                'SELECT * FROM employees WHERE dni = ?',
                [testDNI],
            );
        });

        it('should return employee when found by DNI', async () => {
            const testDNI = '1234567890';

            mockConnection.query.mockResolvedValueOnce([
                [mockEmployee],
            ]);

            const result = await repo.findByDNI(testDNI);

            expect(result).toEqual(mockEmployee);
        });

        it('should return null when employee not found by DNI', async () => {
            const testDNI = '99999999';
            mockConnection.query.mockResolvedValueOnce([
                [],
            ]);

            const result = await repo.findByDNI(testDNI);

            expect(result).toBeNull();
        });

        it('should handle database errors when searching by DNI', async () => {
            const testDNI = '1234567890';
            const errorMessage = 'Database error';
            mockConnection.query.mockRejectedValueOnce(
                new Error(errorMessage),
            );

            await expect(
                repo.findByDNI(testDNI),
            ).rejects.toThrow(errorMessage);
        });
    });

    describe('update', () => {
        it('should call query with correct SQL and parameters for full update', async () => {
            const testId = 1;

            mockConnection.query
                .mockResolvedValueOnce([
                    { affectedRows: 1 },
                ])
                .mockResolvedValueOnce([
                    { ...mockEmployee, ...mockUpdateData },
                ]);

            await repo.update(testId, mockUpdateData);

            //* Verifica el UPDATE...
            expect(
                mockConnection.query,
            ).toHaveBeenCalledWith(
                'UPDATE employees SET dni = ?, name = ?, lastName = ?, email = ?, phone = ?, emailVerified = ? WHERE id = ?',
                [
                    mockUpdateData.dni,
                    mockUpdateData.name,
                    mockUpdateData.lastName,
                    mockUpdateData.email,
                    mockUpdateData.phone,
                    mockUpdateData.emailVerified,
                    testId,
                ],
            );

            //* Verifica que luego llama a findById...
            expect(
                mockConnection.query,
            ).toHaveBeenCalledWith(
                'SELECT * FROM employees WHERE id = ?',
                [testId],
            );
        });

        it('should handle partial updates', async () => {
            const testId = 1;
            const partialUpdate = {
                name: 'Only Name Updated',
            };

            //* Mock para el UPDATE...
            mockConnection.query.mockResolvedValueOnce([
                { affectedRows: 1 },
            ]);

            //* Mock para el findById...
            mockConnection.query.mockResolvedValueOnce([
                [
                    {
                        ...mockEmployee,
                        name: 'Only Name Updated',
                    },
                ],
            ]);

            const result = await repo.update(
                testId,
                partialUpdate,
            );

            //* Verificación básica pero efectiva...
            expect(result.name).toBe('Only Name Updated');
            expect(
                mockConnection.query,
            ).toHaveBeenCalledTimes(2);
        });

        it('should return the updated employee', async () => {
            const testId = 1;
            const updatedEmployee = {
                ...mockEmployee,
                ...mockUpdateData,
            };

            mockConnection.query
                .mockResolvedValueOnce([
                    { affectedRows: 1 },
                ])
                .mockResolvedValueOnce([[updatedEmployee]]);

            const result = await repo.update(
                testId,
                mockUpdateData,
            );

            expect(result).toEqual(updatedEmployee);
        });

        it('should return null when no rows are affected', async () => {
            const testId = 999;
            mockConnection.query.mockResolvedValueOnce([
                { affectedRows: 0 },
            ]);
            mockConnection.query.mockResolvedValueOnce([
                [],
            ]); // findById returns empty

            const result = await repo.update(
                testId,
                mockUpdateData,
            );
            expect(result).toBeNull();
        });

        it('should handle database errors during update', async () => {
            const testId = 1;
            const errorMessage = 'Database error';
            mockConnection.query.mockRejectedValueOnce(
                new Error(errorMessage),
            );

            await expect(
                repo.update(testId, mockUpdateData),
            ).rejects.toThrow(errorMessage);
        });

        it('should handle database errors during subsequent findById', async () => {
            const testId = 1;
            const errorMessage =
                'Failed to fetch updated record';

            mockConnection.query
                .mockResolvedValueOnce([
                    { affectedRows: 1 },
                ]) // UPDATE exitoso
                .mockRejectedValueOnce(
                    new Error(errorMessage),
                ); // Error en findById

            await expect(
                repo.update(testId, mockUpdateData),
            ).rejects.toThrow(errorMessage);
        });
    });
});

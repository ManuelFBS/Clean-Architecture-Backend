import { createPool } from 'mysql2';
import { Database } from '../../../src/infrastructure/db/database';

//* Mock de mysql2/promise para evitar conexiones reales...
jest.mock('mysql2/promise', () => {
    return {
        createPool: jest.fn(() => ({
            getConnection: jest.fn(),
            query: jest.fn(),
            end: jest.fn(),
        })),
    };
});

describe('Database Singleton', () => {
    it('should return the same instance', () => {
        const db1 = Database.getInstance();
        const db2 = Database.getInstance();

        expect(db1).toBe(db2); //> Ambas referencias deben ser iguales...
    });

    it('should return a pool connection', () => {
        const db = Database.getInstance();
        const pool = db.getConnection();

        expect(pool).toBeDefined();
    });
});

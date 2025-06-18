import {
    User,
    UserRole,
} from '../../core/domain/entities/User';
import { UserRepository } from '../../core/domain/repositories/UserRepository';
import { Database } from '../db/database';
import bcrypt from 'bcrypt';

export class UserRepositoryImpl implements UserRepository {
    private db: Database;

    constructor() {
        this.db = Database.getInstance();
    }

    async findByUsername(
        username: string,
    ): Promise<User | null> {
        const connection = await this.db.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username],
        );
        const result = rows as User[];
        return result.length ? result[0] : null;
    }

    async findByDNI(dni: string): Promise<User | null> {
        const connection = await this.db.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE dni = ?',
            [dni],
        );
        const result = rows as User[];
        return result.length ? result[0] : null;
    }

    async create(user: User): Promise<User> {
        const connection = await this.db.getConnection();
        const hashedPassword = await bcrypt.hash(
            user.password,
            10,
        );
        await connection.query(
            'INSERT INTO users (dni, username, password, role) VALUES (?, ?, ?, ?)',
            [
                user.dni,
                user.username,
                hashedPassword,
                user.role,
            ],
        );
        return this.findByDNI(user.dni) as Promise<User>;
    }

    async update(
        dni: string,
        user: Partial<User>,
    ): Promise<User> {
        const connection = await this.db.getConnection();
        let hashedPassword = user.password;
        if (user.password) {
            hashedPassword = await bcrypt.hash(
                user.password,
                10,
            );
        }
        await connection.query(
            'UPDATE users SET username = ?, password = ?, role = ? WHERE dni = ?',
            [user.username, hashedPassword, user.role, dni],
        );
        return this.findByDNI(dni) as Promise<User>;
    }

    async delete(dni: string): Promise<void> {
        const connection = await this.db.getConnection();
        await connection.query(
            'DELETE FROM users WHERE dni = ?',
            [dni],
        );
    }
}

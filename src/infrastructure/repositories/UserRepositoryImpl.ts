import {
    User,
    UserRole,
} from '../../core/domain/entities/User';
import { UserRepository } from '../../core/domain/repositories/UserRepository';
import { Database } from '../db/database';
import bcrypt from 'bcrypt';

function mapRowToUser(row: any): User {
    return new User(
        row.dni,
        row.username,
        row.password,
        row.role,
        row.createdAt ? new Date(row.createdAt) : undefined,
        row.updatedAt ? new Date(row.updatedAt) : undefined,
        undefined, //> Aquí se podría mapear el empleado si se necesita..
    );
}
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
        const result = rows as any[];
        return result.length
            ? mapRowToUser(result[0])
            : null;
    }

    async findByDNI(dni: string): Promise<User | null> {
        const connection = await this.db.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE dni = ?',
            [dni],
        );
        const result = rows as any[];
        return result.length
            ? mapRowToUser(result[0])
            : null;
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

    async countAdmins(): Promise<number> {
        const connection = await this.db.getConnection();
        const [rows] = await connection.query(
            'SELECT COUNT(*) as count FROM users WHERE role IN ("Owner", "Admin")',
        );

        return (rows as any)[0].count;
    }

    //* Método para registrar login...
    async logUserLogin(
        dni: string,
        loginTime: Date,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<void> {
        try {
            const connection =
                await this.db.getConnection();

            //* Crear la tabla 'user_session_logs' si no existe...
            await connection.query(`
                CREATE TABLE IF NOT EXISTS user_session_logs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    dni VARCHAR(20) NOT NULL,
                    action ENUM('login', 'logout') NOT NULL,
                    timestamp DATETIME NOT NULL,
                    ip_address VARCHAR(45),
                    user_agent TEXT,
                    INDEX idx_dni (dni),
                    INDEX idx_timestamp (timestamp),
                    INDEX idx_action (action)
                )
            `);

            //* Insertar el log de login...
            await connection.query(
                'INSERT INTO user_session_logs (dni, action, timestamp, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
                [
                    dni,
                    'login',
                    loginTime,
                    ipAddress,
                    userAgent,
                ],
            );
            console.log(
                `User ${dni} login logged at ${loginTime.toISOString()} from IP: ${ipAddress}`,
            );
        } catch (error) {
            console.error(
                'Error logging user login:',
                error,
            );
            //* No se lanza el error para no interrumpir el proceso de login...
        }
    }

    //* Método para registrar logout (actualizado)...
    async logUserLogout(
        dni: string,
        logoutTime: Date,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<void> {
        try {
            const connection =
                await this.db.getConnection();

            //* Crear la tabla 'user_session_logs' si no existe (por si acaso)
            await connection.query(`
                CREATE TABLE IF NOT EXISTS user_session_logs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    dni VARCHAR(20) NOT NULL,
                    action ENUM('login', 'logout') NOT NULL,
                    timestamp DATETIME NOT NULL,
                    ip_address VARCHAR(45),
                    user_agent TEXT,
                    INDEX idx_dni (dni),
                    INDEX idx_timestamp (timestamp),
                    INDEX idx_action (action)
                )
            `);

            //* Insertar el log de logout...
            await connection.query(
                'INSERT INTO user_session_logs (dni, action, timestamp, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
                [
                    dni,
                    'logout',
                    logoutTime,
                    ipAddress,
                    userAgent,
                ],
            );

            console.log(
                `User ${dni} logout logged at ${logoutTime.toISOString()} from IP: ${ipAddress}`,
            );
        } catch (error) {
            console.error(
                'Error logging user logout:',
                error,
            );
            //* No se lanza el error para no interrumpir el proceso de logout...
        }
    }

    //* Método opcional para obtener sesiones activas...
    async getActiveSessions(
        dni: string,
    ): Promise<
        Array<{ loginTime: Date; ipAddress?: string }>
    > {
        try {
            const connection =
                await this.db.getConnection();

            //* Buscar logins sin logout correspondiente (sesiones activas)...
            const [rows] = await connection.query(
                `
                SELECT l1.timestamp as loginTime, l1.ip_address as ipAddress
                FROM user_session_logs l1
                LEFT JOIN user_session_logs l2 ON 
                    l1.dni = l2.dni AND 
                    l2.action = 'logout' AND 
                    l2.timestamp > l1.timestamp
                WHERE l1.dni = ? AND l1.action = 'login' AND l2.id IS NULL
                ORDER BY l1.timestamp DESC
            `,
                [dni],
            );

            return rows as Array<{
                loginTime: Date;
                ipAddress?: string;
            }>;
        } catch (error) {
            console.error(
                'Error getting active sessions:',
                error,
            );
            return [];
        }
    }

    //* Opcional: Anonimizar IPs para cumplir con GDPR...
    private anonymizeIP(ip: string): string {
        if (ip.includes('.')) {
            //> IPv4: 192.168.1.1 -> 192.168.1.0
            return (
                ip.split('.').slice(0, 3).join('.') + '.0'
            );
        } else {
            //> IPv6: simplificar
            return (
                ip.split(':').slice(0, 4).join(':') + '::'
            );
        }
    }
}

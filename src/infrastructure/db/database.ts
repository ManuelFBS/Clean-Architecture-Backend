import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
    private static instance: Database;
    private connection: mysql.Pool;

    private constructor() {
        this.connection = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    public getConnection(): mysql.Pool {
        return this.connection;
    }
}

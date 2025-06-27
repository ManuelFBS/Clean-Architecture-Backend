"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
const database_1 = require("../db/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserRepositoryImpl {
    constructor() {
        this.db = database_1.Database.getInstance();
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const [rows] = yield connection.query('SELECT * FROM users WHERE username = ?', [username]);
            const result = rows;
            return result.length ? result[0] : null;
        });
    }
    findByDNI(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const [rows] = yield connection.query('SELECT * FROM users WHERE dni = ?', [dni]);
            const result = rows;
            return result.length ? result[0] : null;
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
            yield connection.query('INSERT INTO users (dni, username, password, role) VALUES (?, ?, ?, ?)', [
                user.dni,
                user.username,
                hashedPassword,
                user.role,
            ]);
            return this.findByDNI(user.dni);
        });
    }
    update(dni, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            let hashedPassword = user.password;
            if (user.password) {
                hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
            }
            yield connection.query('UPDATE users SET username = ?, password = ?, role = ? WHERE dni = ?', [user.username, hashedPassword, user.role, dni]);
            return this.findByDNI(dni);
        });
    }
    delete(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            yield connection.query('DELETE FROM users WHERE dni = ?', [dni]);
        });
    }
    countAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const [rows] = yield connection.query('SELECT COUNT(*) as count FROM users WHERE role IN ("Owner", "Admin")');
            return rows[0].count;
        });
    }
    //* Método para registrar login...
    logUserLogin(dni, loginTime, ipAddress, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.db.getConnection();
                //* Crear la tabla 'user_session_logs' si no existe...
                yield connection.query(`
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
                yield connection.query('INSERT INTO user_session_logs (dni, action, timestamp, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)', [
                    dni,
                    'login',
                    loginTime,
                    ipAddress,
                    userAgent,
                ]);
                console.log(`User ${dni} login logged at ${loginTime.toISOString()} from IP: ${ipAddress}`);
            }
            catch (error) {
                console.error('Error logging user login:', error);
                //* No se lanza el error para no interrumpir el proceso de login...
            }
        });
    }
    //* Método para registrar logout (actualizado)...
    logUserLogout(dni, logoutTime, ipAddress, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.db.getConnection();
                //* Crear la tabla 'user_session_logs' si no existe (por si acaso)
                yield connection.query(`
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
                yield connection.query('INSERT INTO user_session_logs (dni, action, timestamp, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)', [
                    dni,
                    'logout',
                    logoutTime,
                    ipAddress,
                    userAgent,
                ]);
                console.log(`User ${dni} logout logged at ${logoutTime.toISOString()} from IP: ${ipAddress}`);
            }
            catch (error) {
                console.error('Error logging user logout:', error);
                //* No se lanza el error para no interrumpir el proceso de logout...
            }
        });
    }
    //* Método opcional para obtener sesiones activas...
    getActiveSessions(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.db.getConnection();
                //* Buscar logins sin logout correspondiente (sesiones activas)...
                const [rows] = yield connection.query(`
                SELECT l1.timestamp as loginTime, l1.ip_address as ipAddress
                FROM user_session_logs l1
                LEFT JOIN user_session_logs l2 ON 
                    l1.dni = l2.dni AND 
                    l2.action = 'logout' AND 
                    l2.timestamp > l1.timestamp
                WHERE l1.dni = ? AND l1.action = 'login' AND l2.id IS NULL
                ORDER BY l1.timestamp DESC
            `, [dni]);
                return rows;
            }
            catch (error) {
                console.error('Error getting active sessions:', error);
                return [];
            }
        });
    }
    //* Opcional: Anonimizar IPs para cumplir con GDPR...
    anonymizeIP(ip) {
        if (ip.includes('.')) {
            //> IPv4: 192.168.1.1 -> 192.168.1.0
            return (ip.split('.').slice(0, 3).join('.') + '.0');
        }
        else {
            //> IPv6: simplificar
            return (ip.split(':').slice(0, 4).join(':') + '::');
        }
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;

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
}
exports.UserRepositoryImpl = UserRepositoryImpl;

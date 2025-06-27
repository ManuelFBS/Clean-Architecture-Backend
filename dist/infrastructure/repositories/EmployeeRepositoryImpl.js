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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRepositoryImpl = void 0;
const database_1 = require("../db/database");
class EmployeeRepositoryImpl {
    constructor() {
        this.db = database_1.Database.getInstance();
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const [rows] = yield connection.query('SELECT * FROM employees');
            return rows;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const [rows] = yield connection.query('SELECT * FROM employees WHERE id = ?', [id]);
            const result = rows;
            return result.length ? result[0] : null;
        });
    }
    findByDNI(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const [rows] = yield connection.query('SELECT * FROM employees WHERE dni = ?', [dni]);
            const result = rows;
            return result.length ? result[0] : null;
        });
    }
    create(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const [result] = yield connection.query('INSERT INTO employees (dni, name, lastName, email, phone, emailVerified) VALUES (?, ?, ?, ?, ?, ?)', [
                employee.dni,
                employee.name,
                employee.lastName,
                employee.email,
                employee.phone,
                employee.emailVerified || false,
            ]);
            const insertId = result.insertId;
            return this.findById(insertId);
        });
    }
    update(id, employee) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            yield connection.query('UPDATE employees SET dni = ?, name = ?, lastName = ?, email = ?, phone = ?, emailVerified = ? WHERE id = ?', [
                employee.dni,
                employee.name,
                employee.lastName,
                employee.email,
                employee.phone,
                employee.emailVerified,
                id,
            ]);
            return this.findById(id);
        });
    }
    updateEmailVerification(dni, verified) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            yield connection.query('UPDATE employees SET emailVerified = ?, updatedAt = ? WHERE dni = ?', [verified, new Date(), dni]);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            yield connection.query('DELETE FROM employees WHERE id = ?', [id]);
        });
    }
}
exports.EmployeeRepositoryImpl = EmployeeRepositoryImpl;

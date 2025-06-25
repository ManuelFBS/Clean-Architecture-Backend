"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
class Employee {
    constructor(id, dni, name, lastName, email, phone, emailVerified, createdAt, updatedAt, user) {
        this.id = id;
        this.dni = dni;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.emailVerified = emailVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
    }
    static create(employeeData) {
        return new Employee(0, //> ID temporal, será asignado por la base de datos
        employeeData.dni, employeeData.name, employeeData.lastName, employeeData.email, employeeData.phone, employeeData.emailVerified || false, new Date(), //> createdAt
        new Date(), //> updatedAt
        employeeData.user);
    }
}
exports.Employee = Employee;

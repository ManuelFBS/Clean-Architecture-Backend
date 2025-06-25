"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRoutes = void 0;
const express_1 = require("express");
const container_1 = require("../../../shared/container");
const TYPES_1 = require("../../../shared/constants/TYPES");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const EmployeeDTO_1 = require("../../dtos/EmployeeDTO");
const EmployeeRoutes = (0, express_1.Router)();
exports.EmployeeRoutes = EmployeeRoutes;
const employeeController = container_1.container.get(TYPES_1.TYPES.EmployeeController);
//~ Función wrapper para manejar promesas...
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
EmployeeRoutes.get('/', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:create'])), employeeController.getAllEmployees.bind(employeeController));
EmployeeRoutes.get('/:id', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:read', 'user:read'])), employeeController.getEmployeeById.bind(employeeController));
EmployeeRoutes.get('/bydni', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:read', 'user:read'])), employeeController.getEmployeeByDNI.bind(employeeController));
EmployeeRoutes.post('/newemployee', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:create'])), (0, validationMiddleware_1.validationMiddleware)(EmployeeDTO_1.CreateEmployeeDTO), employeeController.createEmployee.bind(employeeController));
EmployeeRoutes.put('/:id', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:update'])), employeeController.updateEmployee.bind(employeeController));
EmployeeRoutes.delete('/:id', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:delete'])), employeeController.deleteEmployee.bind(employeeController));

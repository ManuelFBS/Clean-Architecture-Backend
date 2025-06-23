"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Employee_Controller_1 = require("../../controllers/Employee.Controller");
// import { EmployeeRepositoryImpl } from '../../../infrastructure/repositories/EmployeeRepositoryImpl';
// import { EmployeeUseCases } from '../../../core/usecases/employee/EmployeeUseCases';
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const EmployeeDTO_1 = require("../../dtos/EmployeeDTO");
const router = (0, express_1.Router)();
const employeeController = new Employee_Controller_1.EmployeeController();
//~ Función wrapper para manejar promesas...
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.get('/', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:create'])), employeeController.getAllEmployees.bind(employeeController));
router.get('/:id', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:read', 'user:read'])), employeeController.getEmployeeById.bind(employeeController));
router.get('/bydni', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:read', 'user:read'])), employeeController.getEmployeeByDNI.bind(employeeController));
router.post('/newemployee', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:create'])), (0, validationMiddleware_1.validationMiddleware)(EmployeeDTO_1.CreateEmployeeDTO), employeeController.createEmployee.bind(employeeController));
router.put('/:id', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:update'])), employeeController.updateEmployee.bind(employeeController));
router.delete('/:id', authMiddleware_1.authenticate, asyncHandler((0, authMiddleware_1.authorize)(['employee:delete'])), employeeController.deleteEmployee.bind(employeeController));
exports.default = router;

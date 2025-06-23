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
exports.EmployeeController = void 0;
const EmployeeUseCases_1 = require("../../core/usecases/employee/EmployeeUseCases");
const EmployeeDTO_1 = require("../dtos/EmployeeDTO");
const container_1 = require("../../shared/container");
const logger_1 = __importDefault(require("../../shared/logger"));
class EmployeeController {
    constructor() {
        this.employeeUseCases = container_1.container.get(EmployeeUseCases_1.EmployeeUseCases);
    }
    getAllEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employees = yield this.employeeUseCases.getAllEmployees();
                res.status(200).json(employees);
            }
            catch (error) {
                res.status(500).json({
                    message: error.message,
                });
            }
        });
    }
    getEmployeeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const employee = yield this.employeeUseCases.getEmployeeById(id);
                if (employee) {
                    res.status(200).json(employee);
                }
                else {
                    res.status(404).json({
                        message: 'Employee not found...!',
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    message: error.message,
                });
            }
        });
    }
    getEmployeeByDNI(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dni = req.body;
                const employee = yield this.employeeUseCases.getEmployeeByDNI(dni);
                if (employee) {
                    res.status(200).json(employee);
                }
                else {
                    res.status(404).json({
                        message: 'Employee not found',
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    message: error.message,
                });
            }
        });
    }
    createEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employeeData = new EmployeeDTO_1.CreateEmployeeDTO();
                Object.assign(employeeData, req.body);
                const employeeDomain = employeeData.toDomain();
                const newEmployee = yield this.employeeUseCases.createEmployee(employeeDomain);
                logger_1.default.info(`Employee created with ID: ${newEmployee.id}`);
                res.status(201).json(newEmployee);
            }
            catch (error) {
                logger_1.default.error(`Error creating employee: ${error.message}`, { error });
                res.status(error.statusCode || 500).json({
                    status: 'error',
                    message: error.message,
                });
            }
        });
    }
    updateEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const employeeData = req.body;
                const updatedEmployee = yield this.employeeUseCases.updateEmployee(id, employeeData);
                res.status(200).json(updatedEmployee);
            }
            catch (error) {
                res.status(400).json({
                    message: error.message,
                });
            }
        });
    }
    deleteEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                yield this.employeeUseCases.deleteEmployee(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({
                    message: error.message,
                });
            }
        });
    }
}
exports.EmployeeController = EmployeeController;

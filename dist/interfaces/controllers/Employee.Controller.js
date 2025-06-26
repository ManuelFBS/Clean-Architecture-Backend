"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.EmployeeController = void 0;
const inversify_1 = require("inversify");
const EmployeeUseCases_1 = require("../../core/usecases/employee/EmployeeUseCases");
const EmployeeDTO_1 = require("../dtos/EmployeeDTO");
const logger_1 = require("../../shared/logger");
const TYPES_1 = require("../../shared/constants/TYPES");
let EmployeeController = class EmployeeController {
    constructor(logger, employeeUseCases) {
        this.logger = logger;
        this.employeeUseCases = employeeUseCases;
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
                this.logger.info(`Employee created with ID: ${newEmployee.id}`);
                res.status(201).json(newEmployee);
            }
            catch (error) {
                this.logger.error(`Error creating employee: ${error.message}`, { error });
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
};
exports.EmployeeController = EmployeeController;
exports.EmployeeController = EmployeeController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(TYPES_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(EmployeeUseCases_1.EmployeeUseCases)),
    __metadata("design:paramtypes", [logger_1.Logger,
        EmployeeUseCases_1.EmployeeUseCases])
], EmployeeController);

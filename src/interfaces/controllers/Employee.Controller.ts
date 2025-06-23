import { Request, Response } from 'express';
import { EmployeeUseCases } from '../../core/usecases/employee/EmployeeUseCases';
import {
    CreateEmployeeDTO,
    UpdateEmployeeDTO,
} from '../dtos/EmployeeDTO';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { container } from '../../shared/container';
import logger from '../../shared/logger';

export class EmployeeController {
    private employeeUseCases: EmployeeUseCases;
    constructor() {
        this.employeeUseCases = container.get(
            EmployeeUseCases,
        );
    }

    async getAllEmployees(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const employees =
                await this.employeeUseCases.getAllEmployees();

            res.status(200).json(employees);
        } catch (error: any) {
            res.status(500).json({
                message: error.message,
            });
        }
    }

    async getEmployeeById(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const employee =
                await this.employeeUseCases.getEmployeeById(
                    id,
                );

            if (employee) {
                res.status(200).json(employee);
            } else {
                res.status(404).json({
                    message: 'Employee not found...!',
                });
            }
        } catch (error: any) {
            res.status(500).json({
                message: error.message,
            });
        }
    }

    async getEmployeeByDNI(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const dni = req.body;
            const employee =
                await this.employeeUseCases.getEmployeeByDNI(
                    dni,
                );

            if (employee) {
                res.status(200).json(employee);
            } else {
                res.status(404).json({
                    message: 'Employee not found',
                });
            }
        } catch (error: any) {
            res.status(500).json({
                message: error.message,
            });
        }
    }

    async createEmployee(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const employeeData = new CreateEmployeeDTO();
            Object.assign(employeeData, req.body);

            const employeeDomain = employeeData.toDomain();
            const newEmployee =
                await this.employeeUseCases.createEmployee(
                    employeeDomain,
                );

            logger.info(
                `Employee created with ID: ${newEmployee.id}`,
            );

            res.status(201).json(newEmployee);
        } catch (error: any) {
            logger.error(
                `Error creating employee: ${error.message}`,
                { error },
            );
            res.status(error.statusCode || 500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async updateEmployee(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const employeeData: UpdateEmployeeDTO =
                req.body;
            const updatedEmployee =
                await this.employeeUseCases.updateEmployee(
                    id,
                    employeeData,
                );
            res.status(200).json(updatedEmployee);
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async deleteEmployee(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            await this.employeeUseCases.deleteEmployee(id);

            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

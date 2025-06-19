import { Request, Response } from 'express';
import { EmployeeUseCases } from '../../core/usecases/employee/EmployeeUseCases';
import {
    CreateEmployeeDTO,
    UpdateEmployeeDTO,
} from '../dtos/EmployeeDTO';

export class EmployeeController {
    constructor(
        private employeeUseCases: EmployeeUseCases,
    ) {}

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
            const employeeData: CreateEmployeeDTO =
                req.body;
            const newEmployee =
                await this.employeeUseCases.createEmployee(
                    employeeData,
                );

            res.status(201).json(newEmployee);
        } catch (error: any) {
            res.status(400).json({
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

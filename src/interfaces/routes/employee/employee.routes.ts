import { Router } from 'express';
import { container } from '../../../shared/container';
import { EmployeeController } from '../../controllers/Employee.Controller';
import {
    authenticate,
    authorize,
} from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateEmployeeDTO } from '../../dtos/EmployeeDTO';

const EmployeeRoutes = Router();

const employeeController = container.get(
    EmployeeController,
);

//~ Función wrapper para manejar promesas...
const asyncHandler =
    (fn: any) => (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

EmployeeRoutes.get(
    '/',
    authenticate,
    asyncHandler(authorize(['employee:create'])),
    employeeController.getAllEmployees.bind(
        employeeController,
    ),
);

EmployeeRoutes.get(
    '/:id',
    authenticate,
    asyncHandler(authorize(['employee:read', 'user:read'])),
    employeeController.getEmployeeById.bind(
        employeeController,
    ),
);

EmployeeRoutes.get(
    '/bydni',
    authenticate,
    asyncHandler(authorize(['employee:read', 'user:read'])),
    employeeController.getEmployeeByDNI.bind(
        employeeController,
    ),
);

EmployeeRoutes.post(
    '/newemployee',
    authenticate,
    asyncHandler(authorize(['employee:create'])),
    validationMiddleware(CreateEmployeeDTO),
    employeeController.createEmployee.bind(
        employeeController,
    ),
);

EmployeeRoutes.put(
    '/:id',
    authenticate,
    asyncHandler(authorize(['employee:update'])),
    employeeController.updateEmployee.bind(
        employeeController,
    ),
);

EmployeeRoutes.delete(
    '/:id',
    authenticate,
    asyncHandler(authorize(['employee:delete'])),
    employeeController.deleteEmployee.bind(
        employeeController,
    ),
);

export { EmployeeRoutes };

import { Router } from 'express';
import { EmployeeController } from '../../controllers/Employee.Controller';
// import { EmployeeRepositoryImpl } from '../../../infrastructure/repositories/EmployeeRepositoryImpl';
// import { EmployeeUseCases } from '../../../core/usecases/employee/EmployeeUseCases';
import {
    authenticate,
    authorize,
} from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateEmployeeDTO } from '../../dtos/EmployeeDTO';

const router = Router();

const employeeController = new EmployeeController();

//~ Función wrapper para manejar promesas...
const asyncHandler =
    (fn: any) => (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

router.get(
    '/',
    authenticate,
    asyncHandler(authorize(['employee:create'])),
    employeeController.getAllEmployees.bind(
        employeeController,
    ),
);

router.get(
    '/:id',
    authenticate,
    asyncHandler(authorize(['employee:read', 'user:read'])),
    employeeController.getEmployeeById.bind(
        employeeController,
    ),
);

router.get(
    '/bydni',
    authenticate,
    asyncHandler(authorize(['employee:read', 'user:read'])),
    employeeController.getEmployeeByDNI.bind(
        employeeController,
    ),
);

router.post(
    '/newemployee',
    authenticate,
    asyncHandler(authorize(['employee:create'])),
    validationMiddleware(CreateEmployeeDTO),
    employeeController.createEmployee.bind(
        employeeController,
    ),
);

router.put(
    '/:id',
    authenticate,
    asyncHandler(authorize(['employee:update'])),
    employeeController.updateEmployee.bind(
        employeeController,
    ),
);

router.delete(
    '/:id',
    authenticate,
    asyncHandler(authorize(['employee:delete'])),
    employeeController.deleteEmployee.bind(
        employeeController,
    ),
);

export default router;

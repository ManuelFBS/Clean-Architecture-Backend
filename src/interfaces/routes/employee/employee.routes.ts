import { Router } from 'express';
import { EmployeeController } from '../../controllers/Employee.Controller';
import { EmployeeRepositoryImpl } from '../../../infrastructure/repositories/EmployeeRepositoryImpl';
import { EmployeeUseCases } from '../../../core/usecases/employee/EmployeeUseCases';
import {
    authenticate,
    authorize,
} from '../../middlewares/authMiddleware';

const router = Router();

const employeeRepository = new EmployeeRepositoryImpl();
const employeeUseCases = new EmployeeUseCases(
    employeeRepository,
);
const employeeController = new EmployeeController(
    employeeUseCases,
);

//~ Función wrapper para manejar promesas...
const asyncHandler =
    (fn: any) => (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

router.get(
    '/',
    authenticate,
    asyncHandler(authorize(['Owner', 'Admin'])),
    employeeController.getAllEmployees.bind(
        employeeController,
    ),
);

router.get(
    '/:id',
    authenticate,
    asyncHandler(authorize(['Owner', 'Admin', 'Employee'])),
    employeeController.getEmployeeById.bind(
        employeeController,
    ),
);

router.get(
    '/bydni',
    authenticate,
    asyncHandler(authorize(['Owner', 'Admin', 'Employee'])),
    employeeController.getEmployeeByDNI.bind(
        employeeController,
    ),
);

router.post(
    '/newemployee',
    authenticate,
    asyncHandler(authorize(['Owner', 'Admin'])),
    employeeController.createEmployee.bind(
        employeeController,
    ),
);

router.put(
    '/:id',
    authenticate,
    asyncHandler(authorize(['Owner', 'Admin'])),
    employeeController.updateEmployee.bind(
        employeeController,
    ),
);

router.delete(
    '/:id',
    authenticate,
    asyncHandler(authorize(['Owner', 'Admin'])),
    employeeController.deleteEmployee.bind(
        employeeController,
    ),
);

export default router;

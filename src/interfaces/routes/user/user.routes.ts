import { Router } from 'express';
import { UserController } from '../../controllers/User.Controller';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/UserRepositoryImpl';
import { UserUseCases } from '../../../core/usecases/user/UserUseCases';
import {
    authenticate,
    authorize,
} from '../../middlewares/authMiddleware';

const router = Router();

const userRepository = new UserRepositoryImpl();
const userUseCases = new UserUseCases(userRepository);
const userController = new UserController(userUseCases);

//~ Función wrapper para manejar promesas...
const asyncHandler =
    (fn: any) => (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

router.post(
    '/login',
    userController.login.bind(userController),
);
router.post(
    '/',
    authenticate,
    asyncHandler(authorize(['user:create'])),
    userController.createUser.bind(userController),
);

router.put(
    '/:dni',
    authenticate,
    asyncHandler(authorize(['user:update'])),
    userController.updateUser.bind(userController),
);

router.delete(
    '/:dni',
    authenticate,
    asyncHandler(authorize(['user:delete'])),
    userController.deleteUser.bind(userController),
);

router.get(
    '/:dni',
    authenticate,
    asyncHandler(authorize(['user:read'])),
    userController.getUserByDni.bind(userController),
);

export default router;

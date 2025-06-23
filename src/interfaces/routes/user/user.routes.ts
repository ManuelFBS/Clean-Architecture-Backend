/*
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
*/
import { Router } from 'express';
import { UserController } from '../../controllers/User.Controller';
import {
    CreateUserDTO,
    UpdateUserDTO,
    LoginDTO,
} from '../../dtos/UserDTO';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import {
    authenticate,
    authorize,
} from '../../middlewares/authMiddleware';
import {
    apiLimiter,
    authLimiter,
} from '../../middlewares/rateLimiter';

const router = Router();
const userController = new UserController();

//~ Rutas públicas...
router.post(
    '/login',
    authLimiter,
    validationMiddleware(LoginDTO),
    userController.login.bind(userController),
);

//~ Rutas autenticadas...
router.post(
    '/newuser',
    authenticate,
    authorize(['user:create']),
    apiLimiter,
    validationMiddleware(CreateUserDTO),
    userController.createUser.bind(userController),
);

router.put(
    '/:dni',
    authenticate,
    authorize(['user:update']),
    apiLimiter,
    validationMiddleware(UpdateUserDTO),
    userController.updateUser.bind(userController),
);

router.delete(
    '/:dni',
    authenticate,
    authorize(['user:delete']),
    apiLimiter,
    userController.deleteUser.bind(userController),
);

router.get(
    '/:dni',
    authenticate,
    authorize(['user:create']),
    userController.getUserByDNI.bind(userController),
);

export default router;

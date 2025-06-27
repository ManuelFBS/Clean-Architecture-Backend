import { Router } from 'express';
import { container } from '../../../shared/container';
import { UserController } from '../../controllers/User.Controller';
import { TYPES } from '../../../shared/constants/TYPES';
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

const UserRoutes = Router();
const userController = container.get<UserController>(
    TYPES.UserController,
);

//~ Rutas públicas...
UserRoutes.post(
    '/login',
    authLimiter,
    validationMiddleware(LoginDTO),
    userController.login.bind(userController),
);

UserRoutes.post(
    '/logout',
    authenticate,
    userController.logout.bind(userController),
);

//~ Nueva ruta para verificar autenticación
UserRoutes.get(
    '/auth/check',
    authenticate,
    userController.checkAuth.bind(userController),
);

//~ Rutas autenticadas...
UserRoutes.post(
    '/newuser',
    authenticate,
    authorize(['user:create']),
    apiLimiter,
    validationMiddleware(CreateUserDTO),
    userController.createUser.bind(userController),
);

UserRoutes.put(
    '/:dni',
    authenticate,
    authorize(['user:update']),
    apiLimiter,
    validationMiddleware(UpdateUserDTO),
    userController.updateUser.bind(userController),
);

UserRoutes.delete(
    '/:dni',
    authenticate,
    authorize(['user:delete']),
    apiLimiter,
    userController.deleteUser.bind(userController),
);

UserRoutes.get(
    '/:dni',
    authenticate,
    authorize(['user:create']),
    userController.getUserByDNI.bind(userController),
);

export { UserRoutes };

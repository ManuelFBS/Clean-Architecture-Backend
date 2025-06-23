"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_Controller_1 = require("../../controllers/User.Controller");
const UserDTO_1 = require("../../dtos/UserDTO");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const rateLimiter_1 = require("../../middlewares/rateLimiter");
const router = (0, express_1.Router)();
const userController = new User_Controller_1.UserController();
//~ Rutas públicas...
router.post('/login', rateLimiter_1.authLimiter, (0, validationMiddleware_1.validationMiddleware)(UserDTO_1.LoginDTO), userController.login.bind(userController));
//~ Rutas autenticadas...
router.post('/newuser', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['user:create']), rateLimiter_1.apiLimiter, (0, validationMiddleware_1.validationMiddleware)(UserDTO_1.CreateUserDTO), userController.createUser.bind(userController));
router.put('/:dni', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['user:update']), rateLimiter_1.apiLimiter, (0, validationMiddleware_1.validationMiddleware)(UserDTO_1.UpdateUserDTO), userController.updateUser.bind(userController));
router.delete('/:dni', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['user:delete']), rateLimiter_1.apiLimiter, userController.deleteUser.bind(userController));
router.get('/:dni', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['user:create']), userController.getUserByDNI.bind(userController));
exports.default = router;

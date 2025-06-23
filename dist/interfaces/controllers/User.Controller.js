"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const Permission_1 = require("../../core/domain/types/Permission");
const UserUseCases_1 = require("../../core/usecases/user/UserUseCases");
const UserDTO_1 = require("../dtos/UserDTO");
const container_1 = require("../../shared/container");
const logger_1 = __importDefault(require("../../shared/logger"));
const AppError_1 = require("../../shared/errors/AppError");
class UserController {
    constructor() {
        this.userUseCases = container_1.container.get(UserUseCases_1.UserUseCases);
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginData = new UserDTO_1.LoginDTO();
                Object.assign(loginData, req.body);
                const { token, user } = yield this.userUseCases.login(loginData.username, loginData.password);
                logger_1.default.info(`User logged in: ${user.username}`);
                res.status(200).json({ token, user });
            }
            catch (error) {
                logger_1.default.error(`Login failed: ${error.message}`);
                res.status(error.statusCode || 401).json({
                    status: 'error',
                    message: error.message,
                });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //> 1. Verificación segura del usuario autenticado...
                if (!req.user) {
                    throw new AppError_1.UnauthorizedError('Authentication required');
                }
                //> 2. Verificación de permisos con seguridad de tipos...
                if (!(0, Permission_1.hasPermission)(req.user.role, 'user:create')) {
                    throw new AppError_1.ForbiddenError('Insufficient permissions');
                }
                const userData = new UserDTO_1.CreateUserDTO();
                Object.assign(userData, req.body);
                //> Validación adicional para creación de Owners...
                if (userData.role === 'Owner' &&
                    req.user.role !== 'Owner') {
                    throw new AppError_1.ForbiddenError('Only Owners can create other Owners...');
                }
                //> Convertir DTO a formato de dominio (sin hash aún)...
                const userParams = userData.toDomain();
                const newUser = yield this.userUseCases.createUser(userParams);
                logger_1.default.info(`User created: ${newUser.username}`);
                res.status(201).json({
                    dni: newUser.dni,
                    username: newUser.username,
                    role: newUser.role,
                    createdAt: newUser.createdAt,
                });
            }
            catch (error) {
                logger_1.default.error(`Error creating user: ${error.message}`);
                res.status(error.statusCode || 400).json({
                    status: 'error',
                    message: error.message,
                });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dni } = req.params;
                const updateData = new UserDTO_1.UpdateUserDTO();
                Object.assign(updateData, req.body);
                const updatedUser = yield this.userUseCases.updateUser(dni, updateData);
                logger_1.default.info(`User updated: ${updatedUser.username}`);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                logger_1.default.error(`Error updating user: ${error.message}`);
                res.status(error.statusCode || 400).json({
                    status: 'error',
                    message: error.message,
                });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dni } = req.params;
                yield this.userUseCases.deleteUser(dni);
                logger_1.default.info(`User deleted: ${dni}`);
                res.status(204).send();
            }
            catch (error) {
                logger_1.default.error(`Error deleting user: ${error.message}`);
                res.status(error.statusCode || 400).json({
                    status: 'error',
                    message: error.message,
                });
            }
        });
    }
    getUserByDNI(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dni } = req.params;
                const user = yield this.userUseCases.getUserByDNI(dni);
                if (!user) {
                    throw new AppError_1.NotFoundError('User not found');
                }
                res.status(200).json(user);
            }
            catch (error) {
                logger_1.default.error(`Error getting user: ${error.message}`);
                res.status(error.statusCode || 400).json({
                    status: 'error',
                    message: error.message,
                });
            }
        });
    }
}
exports.UserController = UserController;

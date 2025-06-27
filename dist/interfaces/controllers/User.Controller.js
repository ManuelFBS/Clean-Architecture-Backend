"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const inversify_1 = require("inversify");
const Permission_1 = require("../../core/domain/types/Permission");
const UserUseCases_1 = require("../../core/usecases/user/UserUseCases");
const UserDTO_1 = require("../dtos/UserDTO");
const logger_1 = require("../../shared/logger");
const AppError_1 = require("../../shared/errors/AppError");
const TYPES_1 = require("../../shared/constants/TYPES");
let UserController = class UserController {
    constructor(logger, userUseCases) {
        this.logger = logger;
        this.userUseCases = userUseCases;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginData = new UserDTO_1.LoginDTO();
                Object.assign(loginData, req.body);
                //* Obtener información del cliente...
                const ipAddress = req.ip ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress;
                const userAgent = req.get('User-Agent');
                const { token, user } = yield this.userUseCases.login(loginData.username, loginData.password, ipAddress, userAgent);
                this.logger.info(`User logged in: ${user.username} from IP: ${ipAddress}`);
                res.status(200).json({ token, user });
            }
            catch (error) {
                this.logger.error(`Login failed: ${error.message}`);
                res.status(error.statusCode || 401).json({
                    status: 'error',
                    message: error.message,
                });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Obtener el token del header Authorization
                const token = (_a = req
                    .header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
                if (!token) {
                    throw new AppError_1.UnauthorizedError('No token provided');
                }
                //* Obtener información del cliente...
                const ipAddress = req.ip ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress;
                const userAgent = req.get('User-Agent');
                //* Ejecutar el logout...
                yield this.userUseCases.logout(token, ipAddress, userAgent);
                this.logger.info('User logged out successfully');
                res.status(200).json({
                    status: 'success',
                    message: 'Logged out successfully',
                });
            }
            catch (error) {
                this.logger.error(`Logout failed: ${error.message}`);
                res.status(error.statusCode || 400).json({
                    status: 'error',
                    message: error.message,
                });
            }
        });
    }
    checkAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req
                    .header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
                if (!token) {
                    throw new AppError_1.UnauthorizedError('No token provided');
                }
                const isValid = yield this.userUseCases.validateToken(token);
                if (!isValid) {
                    throw new AppError_1.UnauthorizedError('Invalid or expired token');
                }
                //* Decodificar el token para obtener información del usuario...
                const jwt = require('jsonwebtoken');
                const decoded = jwt.decode(token);
                res.status(200).json({
                    status: 'success',
                    authenticated: true,
                    user: {
                        dni: decoded.dni,
                        username: decoded.username,
                        role: decoded.role,
                    },
                });
            }
            catch (error) {
                this.logger.error(`Auth check failed: ${error.message}`);
                res.status(error.statusCode || 401).json({
                    status: 'error',
                    authenticated: false,
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
                this.logger.info(`User created: ${newUser.username}`);
                res.status(201).json({
                    dni: newUser.dni,
                    username: newUser.username,
                    role: newUser.role,
                    createdAt: newUser.createdAt,
                });
            }
            catch (error) {
                this.logger.error(`Error creating user: ${error.message}`);
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
                this.logger.info(`User updated: ${updatedUser.username}`);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                this.logger.error(`Error updating user: ${error.message}`);
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
                this.logger.info(`User deleted: ${dni}`);
                res.status(204).send();
            }
            catch (error) {
                this.logger.error(`Error deleting user: ${error.message}`);
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
                this.logger.error(`Error getting user: ${error.message}`);
                res.status(error.statusCode || 400).json({
                    status: 'error',
                    message: error.message,
                });
            }
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(TYPES_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(UserUseCases_1.UserUseCases)),
    __metadata("design:paramtypes", [logger_1.Logger,
        UserUseCases_1.UserUseCases])
], UserController);

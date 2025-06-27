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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCases = void 0;
const inversify_1 = require("inversify");
const User_1 = require("../../domain/entities/User");
const AppError_1 = require("../../../shared/errors/AppError");
const TYPES_1 = require("../../../shared/constants/TYPES");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let UserUseCases = class UserUseCases {
    constructor(userRepository, emailService, employeeRepository, tokenService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.employeeRepository = employeeRepository;
        this.tokenService = tokenService;
    }
    login(username, password, ipAddress, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByUsername(username);
            if (!user) {
                throw new AppError_1.UnauthorizedError('Invalid credentials');
            }
            const isValidPassword = yield user.validatePassword(password);
            if (!isValidPassword) {
                throw new AppError_1.UnauthorizedError('Invalid credentials');
            }
            const employee = yield this.employeeRepository.findByDNI(user.dni);
            if (employee && !employee.emailVerified) {
                throw new AppError_1.ForbiddenError('Email not verified');
            }
            //* Se registra el login exitoso...
            yield this.userRepository.logUserLogin(user.dni, new Date(), ipAddress, userAgent);
            const token = jsonwebtoken_1.default.sign({
                dni: user.dni,
                username: user.username,
                role: user.role,
            }, process.env.JWT_SECRET || 'default_secret', {
                expiresIn: process.env.JWT_EXPIRES_IN || '2h',
            });
            return { token, user };
        });
    }
    logout(token, ipAddress, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //* Decodificar el token para obtener información del usuario...
                const jwt = require('jsonwebtoken');
                const decoded = jwt.decode(token);
                if (!decoded || !decoded.dni) {
                    throw new AppError_1.UnauthorizedError('Invalid token');
                }
                //* Invalidar el token (agregarlo a la blacklist)...
                yield this.tokenService.invalidateToken(token);
                //* Registrar el logout en el repositorio...
                yield this.userRepository.logUserLogout(decoded.dni, new Date(), ipAddress, userAgent);
                //* Log del evento...
                console.log(`User logged out: ${decoded.username}`);
            }
            catch (error) {
                console.error('Error during logout:', error);
                throw error;
            }
        });
    }
    //* Método para verificar si un token es válido...
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //* Verificar si el token está en la blacklist...
                const isInvalid = yield this.tokenService.isTokenInvalid(token);
                if (isInvalid) {
                    return false;
                }
                //* Verificar que el token sea válido con JWT...
                const jwt = require('jsonwebtoken');
                jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            //* Validar que el empleado exista...
            const employee = yield this.employeeRepository.findByDNI(userData.dni);
            if (!employee) {
                throw new AppError_1.NotFoundError('Employee not found');
            }
            //* Validar username único...
            const existingUser = yield this.userRepository.findByUsername(userData.username);
            if (existingUser) {
                throw new AppError_1.ConflictError('Username already exists');
            }
            //* Validar que no exista otro usuario con el mismo DNI...
            const existingUserByDNI = yield this.userRepository.findByDNI(userData.dni);
            if (existingUserByDNI) {
                throw new AppError_1.ConflictError('User already exists for this employee');
            }
            //* Validar que solo haya un Owner...
            if (userData.role === 'Owner') {
                const adminCount = yield this.userRepository.countAdmins();
                if (adminCount > 0) {
                    throw new AppError_1.BadRequestError('There can only be one Owner');
                }
            }
            return User_1.User.create(userData);
        });
    }
    updateUser(dni, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByDNI(dni);
            if (!existingUser) {
                throw new AppError_1.NotFoundError('User not found');
            }
            //* Validar username único si se está cambiando...
            if (userData.username &&
                userData.username !== existingUser.username) {
                const userWithSameUsername = yield this.userRepository.findByUsername(userData.username);
                if (userWithSameUsername) {
                    throw new AppError_1.ConflictError('Username already taken');
                }
            }
            //* Validar que no se cambie el rol a Owner si ya existe uno...
            if (userData.role === 'Owner') {
                const adminCount = yield this.userRepository.countAdmins();
                if (adminCount > 0 &&
                    existingUser.role !== 'Owner') {
                    throw new AppError_1.BadRequestError('There can only be one Owner');
                }
            }
            return this.userRepository.update(dni, userData);
        });
    }
    deleteUser(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByDNI(dni);
            if (!user) {
                throw new AppError_1.NotFoundError('User not found');
            }
            if (user.role === 'Owner') {
                throw new AppError_1.ForbiddenError('Cannot delete Owner user');
            }
            return this.userRepository.delete(dni);
        });
    }
    getUserByDNI(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findByDNI(dni);
        });
    }
};
exports.UserUseCases = UserUseCases;
exports.UserUseCases = UserUseCases = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(TYPES_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(TYPES_1.TYPES.EmailService)),
    __param(2, (0, inversify_1.inject)(TYPES_1.TYPES.EmployeeRepository)),
    __param(3, (0, inversify_1.inject)(TYPES_1.TYPES.TokenService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UserUseCases);

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
exports.authenticate = authenticate;
exports.authorize = authorize;
const Permission_1 = require("../../core/domain/types/Permission");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const AppError_1 = require("../../shared/errors/AppError");
const container_1 = require("../../shared/container");
const TYPES_1 = require("../../shared/constants/TYPES");
dotenv_1.default.config();
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req
                .header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            if (!token) {
                res.status(401).json({
                    message: 'No token provided',
                });
                return;
            }
            //* Verificar si el token está en la blacklist...
            const tokenService = container_1.container.get(TYPES_1.TYPES.TokenService);
            const isInvalid = yield tokenService.isTokenInvalid(token);
            if (isInvalid) {
                res.status(401).json({
                    message: 'Token has been invalidated',
                });
                return;
            }
            //* Verificar el token con JWT...
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            //* Use type assertion to add user property...
            req.user = {
                dni: decoded.dni,
                username: decoded.username,
                role: decoded.role,
            };
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    });
}
function authorize(permissions) {
    return (req, res, next) => {
        //* Use type assertion to access user property...
        const user = req.user;
        if (!user) {
            throw new AppError_1.UnauthorizedError('Authentication required...');
        }
        const requiredPermissions = Array.isArray(permissions)
            ? permissions
            : [permissions];
        const userPermissions = Permission_1.RolePermissions[user.role] || [];
        const hasPermission = requiredPermissions.every((permission) => userPermissions.includes(permission));
        if (!hasPermission) {
            throw new AppError_1.ForbiddenError('Insufficient permissions...');
        }
        next();
    };
}

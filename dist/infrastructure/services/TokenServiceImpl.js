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
exports.TokenServiceImpl = void 0;
const inversify_1 = require("inversify");
const logger_1 = require("../../shared/logger");
const TYPES_1 = require("../../shared/constants/TYPES");
let TokenServiceImpl = class TokenServiceImpl {
    constructor(logger) {
        this.logger = logger;
        //* En memoria por simplicidad, en producción usar Redis o base de datos...
        this.blacklistedTokens = new Map();
        //* Limpiar tokens expirados cada hora...
        setInterval(() => {
            this.cleanupExpiredTokens();
        }, 60 * 60 * 1000); //> 1 hora...
    }
    invalidateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //* Decodificar el token para obtener la expiración...
                const jwt = require('jsonwebtoken');
                const decoded = jwt.decode(token);
                if (!decoded || !decoded.exp) {
                    throw new Error('Invalid token format');
                }
                //* Agregar a la blacklist con su tiempo de expiración...
                this.blacklistedTokens.set(token, {
                    token,
                    expiresAt: decoded.exp * 1000, //> Convertir a milisegundos...
                });
                this.logger.info(`Token invalidated for user: ${decoded.username || 'unknown'}`);
            }
            catch (error) {
                this.logger.error(`Error invalidating token: ${error}`);
                throw error;
            }
        });
    }
    isTokenInvalid(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blacklistedTokens.has(token);
        });
    }
    cleanupExpiredTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            let cleanedCount = 0;
            for (const [token, tokenData,] of this.blacklistedTokens.entries()) {
                if (tokenData.expiresAt < now) {
                    this.blacklistedTokens.delete(token);
                    cleanedCount++;
                }
            }
            if (cleanedCount > 0) {
                this.logger.info(`Cleaned up ${cleanedCount} expired tokens`);
            }
        });
    }
};
exports.TokenServiceImpl = TokenServiceImpl;
exports.TokenServiceImpl = TokenServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(TYPES_1.TYPES.Logger)),
    __metadata("design:paramtypes", [logger_1.Logger])
], TokenServiceImpl);

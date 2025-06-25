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
exports.EmailServiceImpl = void 0;
const inversify_1 = require("inversify");
const logger_1 = require("../../shared/logger");
const TYPES_1 = require("../../shared/constants/TYPES");
let EmailServiceImpl = class EmailServiceImpl {
    constructor(logger) {
        this.logger = logger;
    }
    sendVerificationEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // En producción, usar un servicio como SendGrid, Mailgun, etc.
            const verificationLink = `http://yourapp.com/verify-email?token=${token}`;
            this.logger.info(`Sending verification email to ${email} with link: ${verificationLink}`);
            // Implementación real iría aquí
        });
    }
    sendPasswordResetEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetLink = `http://yourapp.com/reset-password?token=${token}`;
            this.logger.info(`Sending password reset email to ${email} with link: ${resetLink}`);
            //? Implementación real iría aquí...
        });
    }
};
exports.EmailServiceImpl = EmailServiceImpl;
exports.EmailServiceImpl = EmailServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(TYPES_1.TYPES.Logger)),
    __metadata("design:paramtypes", [logger_1.Logger])
], EmailServiceImpl);

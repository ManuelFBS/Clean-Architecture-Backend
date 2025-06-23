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
exports.EmailServiceImpl = void 0;
const logger_1 = __importDefault(require("../../shared/logger"));
class EmailServiceImpl {
    sendVerificationEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // En producción, usar un servicio como SendGrid, Mailgun, etc.
            const verificationLink = `http://yourapp.com/verify-email?token=${token}`;
            logger_1.default.info(`Sending verification email to ${email} with link: ${verificationLink}`);
            // Implementación real iría aquí
        });
    }
    sendPasswordResetEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetLink = `http://yourapp.com/reset-password?token=${token}`;
            logger_1.default.info(`Sending password reset email to ${email} with link: ${resetLink}`);
            //? Implementación real iría aquí...
        });
    }
}
exports.EmailServiceImpl = EmailServiceImpl;

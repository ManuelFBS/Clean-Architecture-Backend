import { EmailService } from '../../core/domain/services/EmailService';
import logger from '../../shared/logger';

export class EmailServiceImpl implements EmailService {
    async sendVerificationEmail(
        email: string,
        token: string,
    ): Promise<void> {
        // En producción, usar un servicio como SendGrid, Mailgun, etc.
        const verificationLink = `http://yourapp.com/verify-email?token=${token}`;
        logger.info(
            `Sending verification email to ${email} with link: ${verificationLink}`,
        );
        // Implementación real iría aquí
    }

    async sendPasswordResetEmail(
        email: string,
        token: string,
    ): Promise<void> {
        const resetLink = `http://yourapp.com/reset-password?token=${token}`;
        logger.info(
            `Sending password reset email to ${email} with link: ${resetLink}`,
        );

        //? Implementación real iría aquí...
    }
}

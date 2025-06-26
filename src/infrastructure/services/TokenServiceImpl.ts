import { injectable, inject } from 'inversify';
import { TokenService } from '../../core/domain/services/TokenService';
import { Logger } from '../../shared/logger';
import { TYPES } from '../../shared/constants/TYPES';

//* Interfaz para tokens en blacklist...
interface BlacklistedToken {
    token: string;
    expiresAt: number; //> Timestamp de expiración...
}

@injectable()
export class TokenServiceImpl implements TokenService {
    //* En memoria por simplicidad, en producción usar Redis o base de datos...
    private blacklistedTokens: Map<
        string,
        BlacklistedToken
    > = new Map();

    constructor(
        @inject(TYPES.Logger) private logger: Logger,
    ) {
        //* Limpiar tokens expirados cada hora...
        setInterval(
            () => {
                this.cleanupExpiredTokens();
            },
            60 * 60 * 1000,
        ); //> 1 hora...
    }

    async invalidateToken(token: string): Promise<void> {
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

            this.logger.info(
                `Token invalidated for user: ${decoded.username || 'unknown'}`,
            );
        } catch (error) {
            this.logger.error(
                `Error invalidating token: ${error}`,
            );
            throw error;
        }
    }

    async isTokenInvalid(token: string): Promise<boolean> {
        return this.blacklistedTokens.has(token);
    }

    async cleanupExpiredTokens(): Promise<void> {
        const now = Date.now();
        let cleanedCount = 0;

        for (const [
            token,
            tokenData,
        ] of this.blacklistedTokens.entries()) {
            if (tokenData.expiresAt < now) {
                this.blacklistedTokens.delete(token);
                cleanedCount++;
            }
        }

        if (cleanedCount > 0) {
            this.logger.info(
                `Cleaned up ${cleanedCount} expired tokens`,
            );
        }
    }
}

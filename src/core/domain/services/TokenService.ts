// Interface para el servicio de tokens
export interface TokenService {
    // Invalida un token (lo agrega a la blacklist)
    invalidateToken(token: string): Promise<void>;

    // Verifica si un token está en la blacklist
    isTokenInvalid(token: string): Promise<boolean>;

    // Limpia tokens expirados de la blacklist
    cleanupExpiredTokens(): Promise<void>;
}

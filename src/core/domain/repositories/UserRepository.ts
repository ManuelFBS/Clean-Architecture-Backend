import { User, UserCreateParams } from '../entities/User';

export interface UserRepository {
    findByUsername(username: string): Promise<User | null>;
    findByDNI(dni: string): Promise<User | null>;
    create(user: UserCreateParams): Promise<User>;
    update(
        dni: string,
        user: Partial<UserCreateParams>,
    ): Promise<User>;
    delete(dni: string): Promise<void>;
    countAdmins(): Promise<number>;
    //* Métodos para logging de sesiones...
    logUserLogin(
        dni: string,
        loginTime: Date,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<void>;
    logUserLogout(
        dni: string,
        logoutTime: Date,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<void>;
    //* Método opcional para obtener sesiones activas...
    getActiveSessions(
        dni: string,
    ): Promise<
        Array<{ loginTime: Date; ipAddress?: string }>
    >;
}

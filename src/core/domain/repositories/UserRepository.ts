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
}

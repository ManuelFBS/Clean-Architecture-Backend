import { User } from '../../core/domain/entities/User';

export interface UserRepository {
    findUserName(username: string): Promise<User | null>;
    findByDNI(dni: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(dni: string, user: Partial<User>): Promise<User>;
    delete(dni: string): Promise<void>;
}

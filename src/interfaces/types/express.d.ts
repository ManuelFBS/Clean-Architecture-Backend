import { UserRole } from '../../core/domain/entities/User';

declare global {
    namespace Express {
        interface Request {
            user?: {
                dni: string;
                username: string;
                role: UserRole;
            };
        }
    }
}

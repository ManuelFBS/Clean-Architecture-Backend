import { Request } from 'express';
import { UserRole } from '../../core/domain/entities/User';

// Extend the Express Request interface to include the user property
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        username: string;
        role: UserRole;
        dni: string;
    };
}

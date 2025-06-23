import { UserRole } from '../entities/User';

export type Permission =
    | 'employee:create'
    | 'employee:read'
    | 'employee:update'
    | 'employee:delete'
    | 'user:create'
    | 'user:read'
    | 'user:update'
    | 'user:delete'
    | 'auth:verify-email'
    | 'auth:reset-password';

export const RolePermissions: Record<
    UserRole,
    Permission[]
> = {
    Owner: [
        'employee:create',
        'employee:read',
        'employee:update',
        'employee:delete',
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'auth:verify-email',
        'auth:reset-password',
    ],
    Admin: [
        'employee:create',
        'employee:read',
        'employee:update',
        'user:create',
        'user:read',
        'user:update',
        'auth:verify-email',
    ],
    Employee: ['employee:read', 'user:read'],
};

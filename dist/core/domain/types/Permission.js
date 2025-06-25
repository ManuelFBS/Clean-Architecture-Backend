"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = void 0;
exports.hasPermission = hasPermission;
exports.RolePermissions = {
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
function hasPermission(role, permission) {
    return exports.RolePermissions[role].includes(permission);
}

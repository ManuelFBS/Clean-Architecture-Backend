import { EmailServiceImpl } from '../../infrastructure/services/EmailServiceImpl';

export const TYPES = {
    Server: Symbol.for('Server'),
    Database: Symbol.for('Database'),
    Logger: Symbol.for('Logger'),
    EmployeeRepository: Symbol.for('EmployeeRepository'),
    EmployeeUseCases: Symbol.for('EmployeeUseCases'),
    EmployeeRoutes: Symbol.for('EmployeesRoutes'),
    UserRepository: Symbol.for('UserRepository'),
    UserRoutes: Symbol.for('UserRoutes'),
    EmailService: Symbol.for('EmailService'),
    ErrorMiddleware: Symbol.for('ErrorMiddleware'),
};

import { EmailServiceImpl } from '../../infrastructure/services/EmailServiceImpl';

export const TYPES = {
    Server: Symbol.for('Server'),
    Database: Symbol.for('Database'),
    Logger: Symbol.for('Logger'),
    EmployeeRepository: Symbol.for('EmployeeRepository'),
    EmployeeUseCases: Symbol.for('EmployeeUseCases'),
    EmployeeController: Symbol.for('EmployeeController'),
    EmployeeRoutes: Symbol.for('EmployeesRoutes'),
    UserRepository: Symbol.for('UserRepository'),
    UserController: Symbol.for('UserController'),
    UserRoutes: Symbol.for('UserRoutes'),
    TokenService: Symbol.for('TokenService'),
    EmailService: Symbol.for('EmailService'),
    ErrorMiddleware: Symbol.for('ErrorMiddleware'),
};

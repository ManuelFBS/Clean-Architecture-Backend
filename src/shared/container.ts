import 'reflect-metadata';
import { Container } from 'inversify';
import { Database } from '../infrastructure/db/database';
import { EmployeeUseCases } from '../core/usecases/employee/EmployeeUseCases';
import { EmployeeRepository } from '../core/domain/repositories/EmployeeRepository';
import { EmployeeRepositoryImpl } from '../infrastructure/repositories/EmployeeRepositoryImpl';
import { UserUseCases } from '../core/usecases/user/UserUseCases';
import { UserRepository } from '../core/domain/repositories/UserRepository';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { EmailService } from '../core/domain/services/EmailService';
import { EmailServiceImpl } from '../infrastructure/services/EmailServiceImpl';

const container = new Container();

//~ Configuración...
container
    .bind<Database>(Database)
    .toSelf()
    .inSingletonScope();

//~ Repositorios...
container
    .bind<EmployeeRepository>('EmployeeRepository')
    .to(EmployeeRepositoryImpl)
    .inSingletonScope();

container
    .bind<UserRepository>('UserRepository')
    .to(UserRepositoryImpl)
    .inSingletonScope();

//~ Servicios...
container
    .bind<EmailService>('EmailService')
    .to(EmailServiceImpl)
    .inSingletonScope();

//~ Casos de uso...
container
    .bind<EmployeeUseCases>(EmployeeUseCases)
    .toSelf()
    .inSingletonScope();
container
    .bind<UserUseCases>(UserUseCases)
    .toSelf()
    .inSingletonScope();

export { container };

import 'reflect-metadata';
import { Container } from 'inversify';
import { Database } from '../infrastructure/db/database';
import { EmployeeRepository } from '../core/domain/repositories/EmployeeRepository';
import { EmployeeRepositoryImpl } from '../infrastructure/repositories/EmployeeRepositoryImpl';
import { UserRepository } from '../core/domain/repositories/UserRepository';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { EmailService } from '../core/domain/services/EmailService';
import { EmailServiceImpl } from '../infrastructure/services/EmailServiceImpl';
import { EmployeeUseCases } from '../core/usecases/employee/EmployeeUseCases';
import { UserUseCases } from '../core/usecases/user/UserUseCases';

const container = new Container();

//~ Configuración...
container
    .bind<Database>(Database)
    .toSelf()
    .inSingletonScope();

//~ Repositorios...
container
    .bind<EmployeeRepository>('EmployeeRepository')
    .to(EmployeeRepositoryImpl);
container
    .bind<UserRepository>('UserRepository')
    .to(UserRepositoryImpl);

//~ Servicios...
container
    .bind<EmailService>('EmailService')
    .to(EmailServiceImpl);

//~ Casos de uso...
container.bind<EmployeeUseCases>(EmployeeUseCases).toSelf();
container.bind<UserUseCases>(UserUseCases).toSelf();

export { container };

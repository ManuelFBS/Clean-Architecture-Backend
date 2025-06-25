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
import { Server } from '../infrastructure/web/server';
import { Logger } from '../shared/logger';
import { TYPES } from './constants/TYPES';

const container = new Container();

//~ Configuración de los bindings...
//* Base de datos...
container
    .bind<Database>(Database)
    .toSelf()
    .inSingletonScope();

//* Repositorios...
container
    .bind<EmployeeRepository>(TYPES.EmployeeRepository)
    .to(EmployeeRepositoryImpl)
    .inSingletonScope();

container
    .bind<UserRepository>(TYPES.UserRepository)
    .to(UserRepositoryImpl)
    .inSingletonScope();

//* Servicios...
container
    .bind<EmailService>(TYPES.EmailService)
    .to(EmailServiceImpl)
    .inSingletonScope();

//* Casos de uso...
container
    .bind<EmployeeUseCases>(EmployeeUseCases)
    .toSelf()
    .inSingletonScope();

container
    .bind<UserUseCases>(UserUseCases)
    .toSelf()
    .inSingletonScope();

//* Nuevos bindings para el Server y dependencias...
container.bind<Server>(Server).toSelf().inSingletonScope();
container
    .bind<Logger>(TYPES.Logger)
    .to(Logger)
    .inSingletonScope();

export { container };

import 'reflect-metadata';
import { Container } from 'inversify';
import { Database } from '../infrastructure/db/database';
import { EmployeeUseCases } from '../core/usecases/employee/EmployeeUseCases';
import { EmployeeRepository } from '../core/domain/repositories/EmployeeRepository';
import { EmployeeRepositoryImpl } from '../infrastructure/repositories/EmployeeRepositoryImpl';
import { EmployeeController } from '../interfaces/controllers/Employee.Controller';
import { UserUseCases } from '../core/usecases/user/UserUseCases';
import { UserRepository } from '../core/domain/repositories/UserRepository';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { UserController } from '../interfaces/controllers/User.Controller';
import { EmailService } from '../core/domain/services/EmailService';
import { EmailServiceImpl } from '../infrastructure/services/EmailServiceImpl';
import { TokenService } from '../core/domain/services/TokenService';
import { TokenServiceImpl } from '../infrastructure/services/TokenServiceImpl';
import { Server } from '../infrastructure/web/server';
import { Logger } from '../shared/logger';
import { TYPES } from './constants/TYPES';

const container = new Container();

//~ Configuración de los bindings...
//* Base de datos...
container
    .bind<Database>(TYPES.Database)
    .toConstantValue(Database.getInstance());
//! .inSingletonScope();

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

//* Nuevo servicio de tokens...
container
    .bind<TokenService>(TYPES.TokenService)
    .to(TokenServiceImpl)
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

//* Controladores...
container
    .bind<EmployeeController>(TYPES.EmployeeController)
    .to(EmployeeController)
    .inSingletonScope();

container
    .bind<UserController>(TYPES.UserController)
    .to(UserController)
    .inSingletonScope();

//* Nuevos bindings para el Server y dependencias...
container.bind<Server>(Server).toSelf().inSingletonScope();
container
    .bind<Logger>(TYPES.Logger)
    .to(Logger)
    .inSingletonScope();

export { container };

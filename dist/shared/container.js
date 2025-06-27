"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const database_1 = require("../infrastructure/db/database");
const EmployeeUseCases_1 = require("../core/usecases/employee/EmployeeUseCases");
const EmployeeRepositoryImpl_1 = require("../infrastructure/repositories/EmployeeRepositoryImpl");
const Employee_Controller_1 = require("../interfaces/controllers/Employee.Controller");
const UserUseCases_1 = require("../core/usecases/user/UserUseCases");
const UserRepositoryImpl_1 = require("../infrastructure/repositories/UserRepositoryImpl");
const User_Controller_1 = require("../interfaces/controllers/User.Controller");
const EmailServiceImpl_1 = require("../infrastructure/services/EmailServiceImpl");
const TokenServiceImpl_1 = require("../infrastructure/services/TokenServiceImpl");
const server_1 = require("../infrastructure/web/server");
const logger_1 = require("../shared/logger");
const TYPES_1 = require("./constants/TYPES");
const container = new inversify_1.Container();
exports.container = container;
//~ Configuración de los bindings...
//* Base de datos...
container
    .bind(TYPES_1.TYPES.Database)
    .toConstantValue(database_1.Database.getInstance());
//! .inSingletonScope();
//* Repositorios...
container
    .bind(TYPES_1.TYPES.EmployeeRepository)
    .to(EmployeeRepositoryImpl_1.EmployeeRepositoryImpl)
    .inSingletonScope();
container
    .bind(TYPES_1.TYPES.UserRepository)
    .to(UserRepositoryImpl_1.UserRepositoryImpl)
    .inSingletonScope();
//* Servicios...
container
    .bind(TYPES_1.TYPES.EmailService)
    .to(EmailServiceImpl_1.EmailServiceImpl)
    .inSingletonScope();
//* Nuevo servicio de tokens...
container
    .bind(TYPES_1.TYPES.TokenService)
    .to(TokenServiceImpl_1.TokenServiceImpl)
    .inSingletonScope();
//* Casos de uso...
container
    .bind(EmployeeUseCases_1.EmployeeUseCases)
    .toSelf()
    .inSingletonScope();
container
    .bind(UserUseCases_1.UserUseCases)
    .toSelf()
    .inSingletonScope();
//* Controladores...
container
    .bind(TYPES_1.TYPES.EmployeeController)
    .to(Employee_Controller_1.EmployeeController)
    .inSingletonScope();
container
    .bind(TYPES_1.TYPES.UserController)
    .to(User_Controller_1.UserController)
    .inSingletonScope();
//* Nuevos bindings para el Server y dependencias...
container.bind(server_1.Server).toSelf().inSingletonScope();
container
    .bind(TYPES_1.TYPES.Logger)
    .to(logger_1.Logger)
    .inSingletonScope();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const database_1 = require("../infrastructure/db/database");
const EmployeeUseCases_1 = require("../core/usecases/employee/EmployeeUseCases");
const EmployeeRepositoryImpl_1 = require("../infrastructure/repositories/EmployeeRepositoryImpl");
const UserUseCases_1 = require("../core/usecases/user/UserUseCases");
const UserRepositoryImpl_1 = require("../infrastructure/repositories/UserRepositoryImpl");
const EmailServiceImpl_1 = require("../infrastructure/services/EmailServiceImpl");
const container = new inversify_1.Container();
exports.container = container;
//~ Configuración...
container
    .bind(database_1.Database)
    .toSelf()
    .inSingletonScope();
//~ Repositorios...
container
    .bind('EmployeeRepository')
    .to(EmployeeRepositoryImpl_1.EmployeeRepositoryImpl)
    .inSingletonScope();
container
    .bind('UserRepository')
    .to(UserRepositoryImpl_1.UserRepositoryImpl)
    .inSingletonScope();
//~ Servicios...
container
    .bind('EmailService')
    .to(EmailServiceImpl_1.EmailServiceImpl)
    .inSingletonScope();
//~ Casos de uso...
container
    .bind(EmployeeUseCases_1.EmployeeUseCases)
    .toSelf()
    .inSingletonScope();
container
    .bind(UserUseCases_1.UserUseCases)
    .toSelf()
    .inSingletonScope();

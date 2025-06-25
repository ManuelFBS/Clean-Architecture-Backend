"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); //> Debe ser siempre la primera línea...
const container_1 = require("./shared/container");
const server_1 = require("./infrastructure/web/server");
const employee_routes_1 = require("./interfaces/routes/employee/employee.routes");
const user_routes_1 = require("./interfaces/routes/user/user.routes");
console.log('🟢 INICIANDO SERVIDOR');
//~ Resuelve las dependencias del servidor...
const server = container_1.container.get(server_1.Server);
//~ Configura las rutas después de que el contenedor esté inicializado...
const app = server.getApp();
app.use('/api/employees', employee_routes_1.EmployeeRoutes);
app.use('/api/users', user_routes_1.UserRoutes);
//~ Inicia el servidor de forma asíncrona...
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.start();
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}))();

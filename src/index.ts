import 'reflect-metadata'; //> Debe ser siempre la primera línea...
import { container } from './shared/container';
import { Server } from './infrastructure/web/server';
import { EmployeeRoutes } from './interfaces/routes/employee/employee.routes';
import { UserRoutes } from './interfaces/routes/user/user.routes';

console.log('🟢 INICIANDO SERVIDOR');

//~ Resuelve las dependencias del servidor...
const server = container.get<Server>(Server);

//~ Configura las rutas del servidor (incluyendo /test)...
server.configureRoutes();

//~ Configura las rutas después de que el contenedor esté inicializado...
const app = server.getApp();
app.use('/api/employees', EmployeeRoutes);
app.use('/api/users', UserRoutes);

//~ Inicia el servidor de forma asíncrona...
(async () => {
    try {
        await server.start();
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
})();

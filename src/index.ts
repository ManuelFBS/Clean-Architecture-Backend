import 'reflect-metadata'; // Debe ser siempre la primera línea
import { container } from './shared/container';
import { Server } from './infrastructure/web/server';

console.log('🟢 INICIANDO SERVIDOR');

//~ Resuelve las dependencias del servidor...
const server = container.get<Server>(Server);

server.start();

console.log('🟢 INICIANDO SERVIDOR');

import { container } from './shared/container';
import Server from './infrastructure/web/server';

//~ Resuelve las dependencias del servidor...
const server = container.resolve(Server);

server.start();

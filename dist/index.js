"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // Debe ser siempre la primera línea
const container_1 = require("./shared/container");
const server_1 = require("./infrastructure/web/server");
console.log('🟢 INICIANDO SERVIDOR');
//~ Resuelve las dependencias del servidor...
const server = container_1.container.get(server_1.Server);
server.start();

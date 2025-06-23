"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('🟢 INICIANDO SERVIDOR');
const container_1 = require("./shared/container");
const server_1 = __importDefault(require("./infrastructure/web/server"));
//~ Resuelve las dependencias del servidor...
const server = container_1.container.get(server_1.default);
server.start();

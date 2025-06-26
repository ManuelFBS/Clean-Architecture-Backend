"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const TYPES_1 = require("../../shared/constants/TYPES");
const database_1 = require("../db/database");
const dotenv_1 = __importDefault(require("dotenv"));
const errorMiddleware_1 = __importDefault(require("../../interfaces/middlewares/errorMiddleware"));
const logger_1 = require("../../shared/logger");
dotenv_1.default.config();
let Server = class Server {
    constructor(database, logger) {
        this.database = database;
        this.logger = logger;
        //~ Función wrapper para manejar promesas...
        this.asyncHandler = (fn) => (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 4500;
        this.configureMiddleware();
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.database
                    .getConnection()
                    .getConnection();
                yield connection.ping();
                connection.release();
                this.logger.info('Database connected');
            }
            catch (err) {
                this.logger.error('Database connection failed:', err);
                process.exit(1);
            }
        });
    }
    configureMiddleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.logger.info('Middlewares configured');
    }
    configureRoutes() {
        // Las rutas se configurarán después de que el contenedor esté inicializado
        // Esto se hará desde el index.ts
        //> Ruta de prueba para verificar el funcionamiento del Servidor...
        this.app.get('/test', (req, res) => {
            res.send('Server is working...!');
        });
    }
    getApp() {
        return this.app;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // Inicializar la base de datos antes de iniciar el servidor
            yield this.initializeDatabase();
            // Configurar el middleware de errores AL FINAL, después de todas las rutas
            this.app.use(errorMiddleware_1.default);
            this.logger.info('Error handling configured');
            this.app.listen(this.port, () => {
                this.logger.info(`Server running on port ${this.port}`);
            });
            //> Manejo de errores no capturados...
            process.on('unhandledRejection', (reason, promise) => {
                this.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
            });
            process.on('uncaughtException', (error) => {
                this.logger.error('Uncaught Exception:', error);
                process.exit(1);
            });
        });
    }
};
exports.Server = Server;
exports.Server = Server = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(TYPES_1.TYPES.Database)),
    __param(1, (0, inversify_1.inject)(TYPES_1.TYPES.Logger)),
    __metadata("design:paramtypes", [database_1.Database,
        logger_1.Logger])
], Server);

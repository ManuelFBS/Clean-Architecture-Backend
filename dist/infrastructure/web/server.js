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
const logger_1 = require("../../shared/logger");
dotenv_1.default.config();
let Server = class Server {
    constructor(employeeRoutes, userRoutes, database, errorMiddleware, logger) {
        this.employeeRoutes = employeeRoutes;
        this.userRoutes = userRoutes;
        this.database = database;
        this.errorMiddleware = errorMiddleware;
        this.logger = logger;
        //~ Función wrapper para manejar promesas...
        this.asyncHandler = (fn) => (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 4500;
        this.initializeDatabase();
        this.configureMiddleware();
        this.configureRoutes();
        this.configureErrorHandling();
    }
    initializeDatabase() {
        // Database.getInstance();
        this.database
            .getConnection()
            .getConnection()
            .then(() => {
            this.logger.info('Database connected');
        })
            .catch((err) => {
            this.logger.error('Database connection failed:', err);
            process.exit(1);
        });
    }
    configureMiddleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.logger.info('Middlewares configured');
    }
    configureRoutes() {
        this.app.use('/api/employees', this.employeeRoutes);
        this.app.use('/api/users', this.userRoutes);
    }
    configureErrorHandling() {
        this.app.use(this.asyncHandler(this.errorMiddleware));
        this.logger.info('Error handling configured');
        //> Ruta de prueba para verificar el funcionamiento del Servidor...
        this.app.get('/test', (req, res) => {
            res.send('Server is working...!');
        });
    }
    start() {
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
    }
};
exports.Server = Server;
exports.Server = Server = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(TYPES_1.TYPES.EmployeeRoutes)),
    __param(1, (0, inversify_1.inject)(TYPES_1.TYPES.UserRoutes)),
    __param(2, (0, inversify_1.inject)(TYPES_1.TYPES.Database)),
    __param(3, (0, inversify_1.inject)(TYPES_1.TYPES.ErrorMiddleware)),
    __param(4, (0, inversify_1.inject)(TYPES_1.TYPES.Logger)),
    __metadata("design:paramtypes", [Object, Object, database_1.Database, Object, logger_1.Logger])
], Server);
// export default Server;

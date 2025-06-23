"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const employee_routes_1 = __importDefault(require("../../interfaces/routes/employee/employee.routes"));
const user_routes_1 = __importDefault(require("../../interfaces/routes/user/user.routes"));
const database_1 = require("../db/database");
const dotenv_1 = __importDefault(require("dotenv"));
const errorMiddleware_1 = require("../../interfaces/middlewares/errorMiddleware");
const logger_1 = __importDefault(require("../../shared/logger"));
dotenv_1.default.config();
class Server {
    constructor() {
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
        database_1.Database.getInstance();
    }
    configureMiddleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    configureRoutes() {
        this.app.use('/api/employees', employee_routes_1.default);
        this.app.use('/api/users', user_routes_1.default);
    }
    configureErrorHandling() {
        this.app.use(this.asyncHandler(errorMiddleware_1.errorMiddleware));
        logger_1.default.info('Error handling configured');
        //> Ruta de prueba para verificar el funcionamiento del Servidor...
        this.app.get('/test', (req, res) => {
            res.send('Server is working...!');
        });
    }
    start() {
        logger_1.default.info(`Server running on port ${this.port}`);
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
        //> Manejo de errores no capturados...
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });
        process.on('uncaughtException', (error) => {
            logger_1.default.error('Uncaught Exception:', error);
            process.exit(1);
        });
    }
}
exports.default = Server;

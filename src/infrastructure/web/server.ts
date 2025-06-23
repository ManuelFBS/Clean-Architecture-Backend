import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import employeeRoutes from '../../interfaces/routes/employee/employee.routes';
import userRoutes from '../../interfaces/routes/user/user.routes';
import { Database } from '../db/database';
import dotenv from 'dotenv';
import { errorMiddleware } from '../../interfaces/middlewares/errorMiddleware';
import logger from '../../shared/logger';

dotenv.config();

class Server {
    private app: express.Application;
    private port: string | number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4500;
        this.initializeDatabase();
        this.configureMiddleware();
        this.configureRoutes();
        this.configureErrorHandling();
    }

    //~ Función wrapper para manejar promesas...
    asyncHandler =
        (fn: any) => (req: any, res: any, next: any) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

    private initializeDatabase(): void {
        Database.getInstance();
    }

    private configureMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private configureRoutes(): void {
        this.app.use('/api/employees', employeeRoutes);
        this.app.use('/api/users', userRoutes);
    }

    private configureErrorHandling(): void {
        this.app.use(this.asyncHandler(errorMiddleware));
        logger.info('Error handling configured');

        //> Ruta de prueba para verificar el funcionamiento del Servidor...
        this.app.get('/test', (req, res) => {
            res.send('Server is working...!');
        });
    }

    public start(): void {
        logger.info(`Server running on port ${this.port}`);
        this.app.listen(this.port, () => {
            console.log(
                `Server running on port ${this.port}`,
            );
        });

        //> Manejo de errores no capturados...
        process.on(
            'unhandledRejection',
            (reason, promise) => {
                logger.error(
                    'Unhandled Rejection at:',
                    promise,
                    'reason:',
                    reason,
                );
            },
        );

        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });
    }
}

export default Server;

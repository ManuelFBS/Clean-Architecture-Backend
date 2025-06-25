import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import express from 'express';
import cors from 'cors';
import { TYPES } from '../../shared/constants/TYPES';
import { EmployeeRoutes } from '../../interfaces/routes/employee/employee.routes';
import { UserRoutes } from '../../interfaces/routes/user/user.routes';
import { Database } from '../db/database';
import dotenv from 'dotenv';
import { ErrorMiddleware } from '../../interfaces/middlewares/errorMiddleware';
import { Logger } from '../../shared/logger';

dotenv.config();

@injectable()
export class Server {
    private app: express.Application;
    private port: string | number;

    constructor(
        @inject(TYPES.EmployeeRoutes)
        private employeeRoutes: typeof EmployeeRoutes,
        @inject(TYPES.UserRoutes)
        private userRoutes: typeof UserRoutes,
        @inject(TYPES.Database) private database: Database,
        @inject(TYPES.ErrorMiddleware)
        private errorMiddleware: typeof ErrorMiddleware,
        @inject(TYPES.Logger) private logger: Logger,
    ) {
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
        // Database.getInstance();
        this.database
            .getConnection()
            .getConnection()
            .then(() => {
                this.logger.info('Database connected');
            })
            .catch((err: Error) => {
                this.logger.error(
                    'Database connection failed:',
                    err,
                );
                process.exit(1);
            });
    }

    private configureMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.logger.info('Middlewares configured');
    }

    private configureRoutes(): void {
        this.app.use('/api/employees', this.employeeRoutes);
        this.app.use('/api/users', this.userRoutes);
    }

    private configureErrorHandling(): void {
        this.app.use(
            this.asyncHandler(this.errorMiddleware),
        );
        this.logger.info('Error handling configured');

        //> Ruta de prueba para verificar el funcionamiento del Servidor...
        this.app.get('/test', (req, res) => {
            res.send('Server is working...!');
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            this.logger.info(
                `Server running on port ${this.port}`,
            );
        });

        //> Manejo de errores no capturados...
        process.on(
            'unhandledRejection',
            (reason, promise) => {
                this.logger.error(
                    'Unhandled Rejection at:',
                    promise,
                    'reason:',
                    reason,
                );
            },
        );

        process.on('uncaughtException', (error) => {
            this.logger.error('Uncaught Exception:', error);
            process.exit(1);
        });
    }
}

// export default Server;

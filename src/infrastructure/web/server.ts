import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import express from 'express';
import cors from 'cors';
import { TYPES } from '../../shared/constants/TYPES';
import { Database } from '../db/database';
import dotenv from 'dotenv';
import ErrorMiddleware from '../../interfaces/middlewares/errorMiddleware';
import { Logger } from '../../shared/logger';

dotenv.config();

@injectable()
export class Server {
    private app: express.Application;
    private port: string | number;

    constructor(
        @inject(TYPES.Database) private database: Database,
        @inject(TYPES.Logger) private logger: Logger,
    ) {
        this.app = express();
        this.port = process.env.PORT || 4500;
        this.configureMiddleware();
    }

    //~ Función wrapper para manejar promesas...
    asyncHandler =
        (fn: any) => (req: any, res: any, next: any) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

    private async initializeDatabase(): Promise<void> {
        try {
            const connection = await this.database
                .getConnection()
                .getConnection();
            await connection.ping();
            connection.release();
            this.logger.info('Database connected');
        } catch (err: any) {
            this.logger.error(
                'Database connection failed:',
                err,
            );
            process.exit(1);
        }
    }

    private configureMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.logger.info('Middlewares configured');
    }

    public configureRoutes(): void {
        // Las rutas se configurarán después de que el contenedor esté inicializado
        // Esto se hará desde el index.ts

        //> Ruta de prueba para verificar el funcionamiento del Servidor...
        this.app.get('/test', (req, res) => {
            res.send('Server is working...!');
        });
    }

    public getApp(): express.Application {
        return this.app;
    }

    public async start(): Promise<void> {
        // Inicializar la base de datos antes de iniciar el servidor
        await this.initializeDatabase();

        // Configurar el middleware de errores AL FINAL, después de todas las rutas
        this.app.use(ErrorMiddleware);
        this.logger.info('Error handling configured');

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

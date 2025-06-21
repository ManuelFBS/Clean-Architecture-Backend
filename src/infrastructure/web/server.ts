import express from 'express';
import cors from 'cors';
import employeeRoutes from '../../interfaces/routes/employee/employee.routes';
import userRoutes from '../../interfaces/routes/user/user.routes';
import { Database } from '../db/database';
import dotenv from 'dotenv';

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
    }

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

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(
                `Server running on port ${this.port}`,
            );
        });
    }
}

export default Server;

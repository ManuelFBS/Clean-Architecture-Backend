import { Request, Response } from 'express';
import { UserUseCases } from '../../core/usecases/user/UserUseCases';
import {
    CreateUserDTO,
    UpdateUserDTO,
    LoginDTO,
} from '../dtos/UserDTO';

export class UseController {
    constructor(private userUseCases: UserUseCases) {}

    async login(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const credential: LoginDTO = req.body;
            const { token, user } =
                await this.userUseCases.login(
                    credential.username,
                    credential.password,
                );

            res.status(200).json({ token, user });
        } catch (error: any) {
            res.status(401).json({
                message: error.message,
            });
        }
    }

    async createUser(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const userData: CreateUserDTO = req.body;
            const newUser =
                await this.userUseCases.createUser(
                    userData,
                );
            res.status(201).json(newUser);
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async updateUser(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const dni = req.params.dni;
            const userData: UpdateUserDTO = req.body;
            const updatedUser =
                await this.userUseCases.updateUser(
                    dni,
                    userData,
                );
            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async deleteUser(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const dni = req.params.dni;
            await this.userUseCases.deleteUser(dni);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({
                message: error.message,
            });
        }
    }

    async getUserByDni(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const dni = req.params.dni;
            const user =
                await this.userUseCases.getUserByDNI(dni);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    message: 'User not found',
                });
            }
        } catch (error: any) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

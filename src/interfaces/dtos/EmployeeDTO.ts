import {
    IsString,
    IsEmail,
    IsPhoneNumber,
    Length,
} from 'class-validator';
import { Employee } from '../../core/domain/entities/Employee';

export class CreateEmployeeDTO {
    @IsString()
    @Length(8, 20)
    dni: string;

    @IsString()
    @Length(2, 50)
    name: string;

    @IsString()
    @Length(2, 50)
    lastName: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string;

    toDomain(): Omit<
        Employee,
        'id' | 'createdAt' | 'updatedAt'
    > {
        return {
            dni: this.dni,
            name: this.name,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            emailVerified: false,
            user: undefined,
        };
    }
}

export class UpdateEmployeeDTO {
    @IsString()
    @Length(8, 20)
    dni?: string;

    @IsString()
    @Length(2, 50)
    name?: string;

    @IsString()
    @Length(2, 50)
    lastName?: string;

    @IsEmail()
    email?: string;

    @IsPhoneNumber()
    phone?: string;
}

import {
    IsString,
    IsEmail,
    IsPhoneNumber,
    Length,
    Matches,
} from 'class-validator';

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

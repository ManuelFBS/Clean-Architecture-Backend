import {
    IsString,
    Length,
    Matches,
    IsIn,
    IsNotEmpty,
} from 'class-validator';
import {
    UserCreateParams,
    UserRole,
} from '../../core/domain/entities/User';

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

export class CreateUserDTO {
    @IsString()
    @Length(8, 20)
    @IsNotEmpty()
    dni: string;

    @IsString()
    @Length(4, 20)
    @Matches(usernameRegex, {
        message:
            'Username must contain only letters, numbers and underscores',
    })
    username: string;

    @IsString()
    @Length(8, 100)
    @Matches(passwordRegex, {
        message:
            'Password must contain at least one uppercase, one lowercase, one number and one special character',
    })
    password: string;

    @IsIn(['Owner', 'Admin', 'Employee'])
    role: UserRole;

    toDomain(): UserCreateParams {
        return {
            dni: this.dni,
            username: this.username,
            password: this.password, // Contraseña en texto plano
            role: this.role,
        };
    }
}

export class UpdateUserDTO {
    @IsString()
    @Length(4, 20)
    @Matches(usernameRegex, {
        message: 'Invalid username format',
    })
    username?: string;

    @IsString()
    @Length(8, 100)
    @Matches(passwordRegex, {
        message: 'Password too weak',
    })
    password?: string;

    @IsIn(['Owner', 'Admin', 'Employee'])
    role?: UserRole;
}

export class LoginDTO {
    @IsString()
    @Length(4, 20)
    username: string;

    @IsString()
    @Length(8, 100)
    password: string;
}

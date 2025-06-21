import {
    IsString,
    Length,
    Matches,
    IsIn,
} from 'class-validator';
import { UserRole } from '../../core/domain/entities/User';

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

export class CreateUserDTO {
    @IsString()
    @Length(8, 20)
    dni: string;

    @IsString()
    @Length(4, 20)
    @Matches(usernameRegex, {
        message:
            'Username must contain only letters, numbers and underscores',
    })
    username: string;

    @IsString()
    @Length(4, 20)
    @Matches(passwordRegex, {
        message:
            'Password must contain at least one uppercase letter, one \r\n' +
            'lowercase letter, one number and one special character',
    })
    password: string;

    @IsIn(['Owner', 'Admin', 'Employee'])
    role: UserRole;
}

export class UpdateUserDTO {
    @IsString()
    @Length(4, 20)
    @Matches(usernameRegex, {
        message:
            'Username must contain only letters, numbers and underscores',
    })
    username?: string;

    @IsString()
    @Length(8, 100)
    @Matches(passwordRegex, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    password?: string;

    @IsIn(['Owner', 'Admin', 'Employee'])
    role?: UserRole;
}

export class LoginDTO {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

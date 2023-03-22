import { IsEmail, IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { Role } from "src/modules/auth/auth.interfaces";
import { UserRole } from "src/modules/user-roles/entities/user-role.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsString()
    @IsNotEmpty()
    lastnames: string;

    @IsString()
    @IsNotEmpty()
    password: string

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    role: UserRole;
}

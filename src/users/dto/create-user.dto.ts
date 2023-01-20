import { IsEmail, IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { Role } from "src/auth/auth.interfaces";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsString()
    @IsNotEmpty()
    lastnames: string;

    @ValidateIf(o => o.role === Role.ADMIN)
    @IsString()
    @IsNotEmpty()
    password: string

    @ValidateIf(o => o.role === Role.ADMIN)
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    role: string;
}

import { IsEmail, IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { Language } from "src/modules/languages/entities/language.entity";
import { Role } from "src/modules/roles/entities/role.entity";

export class CreateAgentDto {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsString()
    @IsNotEmpty()
    lastnames: string;

    // @ValidateIf(o => o.role === Role.ADMIN)
    // @IsString()
    // @IsNotEmpty()
    // password: string

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    sex: string;

    @IsNotEmpty()
    role: Role

    @IsNotEmpty()
    languages?: Language[]
}

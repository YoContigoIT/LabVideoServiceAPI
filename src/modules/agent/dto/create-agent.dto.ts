import { IsEmail, IsNotEmpty, IsString, IsArray } from "class-validator";
import { Language } from "src/modules/languages/entities/language.entity";
import { Role } from "src/modules/roles/entities/role.entity";

export class CreateAgentDto {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsString()
    @IsNotEmpty()
    lastnames: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    sex: string;

    @IsNotEmpty()
    role: Role

    @IsNotEmpty()
    @IsArray()
    languages?: Language[]
}

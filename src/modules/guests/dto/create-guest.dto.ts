import { IsArray, IsJSON, IsNotEmpty, IsObject, IsString } from "class-validator";
import { Language } from "src/modules/languages/entities/language.entity";

export class CreateGuestDto {
    @IsString()
    name?: string

    @IsObject()
    details?: any

    @IsNotEmpty()
    gender?: string

    @IsNotEmpty()
    languages?: Language[]
}

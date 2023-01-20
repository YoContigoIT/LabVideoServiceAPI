import { IsArray, IsJSON, IsObject, IsString } from "class-validator";

export class CreateGuestDto {
    @IsString()
    name?: string

    @IsObject()
    details?: any
}

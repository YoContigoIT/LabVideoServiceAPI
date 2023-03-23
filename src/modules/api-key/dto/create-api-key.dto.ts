import { IsNotEmpty, IsObject, IsString } from "class-validator"

export class CreateApiKeyDto {
    @IsNotEmpty()
    @IsString()
    clientId: string

    @IsObject()
    details?: any
}

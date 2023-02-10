import { IsNotEmpty, IsOptional } from "class-validator"

export class CreateRecordingDto {
    @IsNotEmpty()
    callRecordId: string

    @IsOptional()
    uri?: string
}

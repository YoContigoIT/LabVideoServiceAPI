import { IsNotEmpty } from "class-validator"

export class CreateRecordingMarkDto {
    @IsNotEmpty()
    markTime: string

    messageText?: string

    @IsNotEmpty()
    recordingMarkTypeId: string

    @IsNotEmpty()
    recordingId: string
}

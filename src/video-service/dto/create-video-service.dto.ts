import { IsNotEmpty } from "class-validator";

export class CreateVideoServiceDto {}

export class startRecordingVideoServiceDto {
    @IsNotEmpty()
    socketId

    @IsNotEmpty()
    sessionId

    @IsNotEmpty()
    connectionId
}

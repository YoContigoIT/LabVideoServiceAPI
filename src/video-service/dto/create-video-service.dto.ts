import { IsNotEmpty } from "class-validator";

export class CreateVideoServiceDto {}

export class RecordingVideoServiceDto {
    @IsNotEmpty()
    socketId

    @IsNotEmpty()
    sessionId

    @IsNotEmpty()
    connectionId
}

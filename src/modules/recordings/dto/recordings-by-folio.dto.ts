import { IsNotEmpty, IsString } from "class-validator"

export class RecordingsByFolioDto {
    @IsNotEmpty()
    @IsString()
    folio: string
}

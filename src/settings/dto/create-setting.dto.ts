import { IsOptional, IsNumber, IsString } from "class-validator"

export class CreateSettingDto {
    @IsOptional()
    openViduRecord?: boolean

    @IsOptional()
    openViduRecordingMode?: string

    @IsOptional()
    openViduRecordingHeight?: number

    @IsOptional()
    openViduRecordingWidth?: number

    @IsOptional()
    openViduRecordingLayout?: string

    @IsOptional()
    openViduRecordingFrameRate?: number
}

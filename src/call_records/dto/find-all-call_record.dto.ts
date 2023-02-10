import { IsDateString, IsOptional, IsString } from "class-validator";

export class FindAllCallRecordDto {

    @IsString()
    @IsOptional()
    agentConnectionId: string;

    @IsString()
    @IsOptional()
    guestConnectionId?: string;

    @IsDateString()
    @IsOptional()
    sessionStartedAt?: Date;
}

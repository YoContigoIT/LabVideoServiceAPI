import { IsOptional } from "class-validator";
import { Agent } from "src/modules/agent/entities/agent.entity";
import { Guest } from "src/modules/guests/entities/guest.entity";

export class GetRecordingsDto {
    @IsOptional()
    guestUuid?: Guest;

    @IsOptional()
    agentUuid?: string;

    @IsOptional()
    fromDate?: Date

    @IsOptional()
    toDate?: Date

    @IsOptional()
    id?: string

    @IsOptional()
    callRecordId?: number

    @IsOptional()
    agentConnectionId?: string

    @IsOptional()
    guestConnectionId?: string
}
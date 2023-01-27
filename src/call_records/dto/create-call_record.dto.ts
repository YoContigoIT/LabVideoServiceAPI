import { IsJSON, IsNotEmpty } from "class-validator";
import { AgentsConnection } from "src/agents-connection/entities/agents-connection.entity";
import { GuestsConnection } from "src/guests-connection/entities/guests-connection.entity";

export class CreateCallRecordDto {
    @IsNotEmpty()
    agentConnectionId: AgentsConnection

    @IsNotEmpty()
    guestConnectionId: GuestsConnection

    @IsJSON()
    details?: any

    @IsNotEmpty()
    sessionStartedAt: Date

    sessionFinishedAt?: Date
}

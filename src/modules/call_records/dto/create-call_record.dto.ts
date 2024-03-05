import { IsJSON, IsNotEmpty, IsOptional } from 'class-validator';
import { AgentsConnection } from 'src/modules/agents-connection/entities/agents-connection.entity';
import { GuestsConnection } from 'src/modules/guests-connection/entities/guests-connection.entity';

export class CreateCallRecordDto {
  @IsNotEmpty()
  agentConnectionId: AgentsConnection;

  @IsNotEmpty()
  guestConnectionId: GuestsConnection;

  @IsJSON()
  details?: any;

  @IsNotEmpty()
  sessionStartedAt: Date;
}

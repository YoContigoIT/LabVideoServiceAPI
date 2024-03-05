import { IsNotEmpty, IsOptional } from 'class-validator';
import { Agent } from 'src/modules/agent/entities/agent.entity';

export class CreateAgentsConnectionDto {
  @IsNotEmpty()
  agent: Agent;

  @IsOptional()
  ip?: string;

  @IsOptional()
  typeClientBrowser?: string;
}

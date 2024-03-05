import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Language } from 'src/modules/languages/entities/language.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { CreateAgentDto } from './create-agent.dto';

export class UpdateAgentDto extends PartialType(CreateAgentDto) {
  @IsOptional()
  names?: string;

  @IsOptional()
  lastnames?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  sex?: string;

  @IsOptional()
  role?: Role;

  @IsOptional()
  languages?: Language[];
}

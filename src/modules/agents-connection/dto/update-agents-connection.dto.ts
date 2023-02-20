import { PartialType } from '@nestjs/mapped-types';
import { CreateAgentsConnectionDto } from './create-agents-connection.dto';

export class UpdateAgentsConnectionDto extends PartialType(CreateAgentsConnectionDto) {}

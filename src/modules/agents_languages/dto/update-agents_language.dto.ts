import { PartialType } from '@nestjs/swagger';
import { CreateAgentsLanguageDto } from './create-agents_language.dto';

export class UpdateAgentsLanguageDto extends PartialType(CreateAgentsLanguageDto) {}

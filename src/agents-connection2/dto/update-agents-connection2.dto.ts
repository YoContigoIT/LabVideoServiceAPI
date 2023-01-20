import { PartialType } from '@nestjs/mapped-types';
import { CreateAgentsConnection2Dto } from './create-agents-connection2.dto';

export class UpdateAgentsConnection2Dto extends PartialType(CreateAgentsConnection2Dto) {
  id: number;
}

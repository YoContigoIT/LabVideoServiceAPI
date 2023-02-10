import { PartialType } from '@nestjs/swagger';
import { CreateRecordingsMarkTypeDto } from './create-recordings-mark-type.dto';

export class UpdateRecordingsMarkTypeDto extends PartialType(CreateRecordingsMarkTypeDto) {}

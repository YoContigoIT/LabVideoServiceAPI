import { PartialType } from '@nestjs/mapped-types';
import { CreateCallRecordDto } from './create-call_record.dto';

export class UpdateCallRecordDto extends PartialType(CreateCallRecordDto) {}

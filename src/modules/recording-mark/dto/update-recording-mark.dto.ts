import { PartialType } from '@nestjs/swagger';
import { CreateRecordingMarkDto } from './create-recording-mark.dto';

export class UpdateRecordingMarkDto extends PartialType(CreateRecordingMarkDto) {}

import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateRecordingMarkDto } from './create-recording-mark.dto';

export class UpdateRecordingMarkDto extends PartialType(
  CreateRecordingMarkDto,
) {
  @IsNotEmpty()
  markTime: string;

  messageText?: string;

  @IsNotEmpty()
  recordingMarkTypeId: string;

  @IsNotEmpty()
  recordingId: string;
}

import { IsNotEmpty, IsOptional } from 'class-validator';
import { CallRecord } from 'src/modules/call_records/entities/call_record.entity';

export class CreateRecordingDto {
  @IsNotEmpty()
  callRecordId: CallRecord;

  @IsOptional()
  uri?: string;

  @IsNotEmpty()
  sessionId: string;
}

import { PartialType } from '@nestjs/swagger';
import { CreateRecordingsMarkTypeDto } from './create-recordings-mark-type.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRecordingsMarkTypeDto extends PartialType(
  CreateRecordingsMarkTypeDto,
) {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  typeTitle: string;
}

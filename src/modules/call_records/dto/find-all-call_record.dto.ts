import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindAllCallRecordDto {
  @IsUUID()
  @IsOptional()
  guestUuid?: string;

  @IsUUID()
  @IsOptional()
  agentUuid?: string;

  @IsString()
  @IsOptional()
  agentConnectionId: string;

  @IsString()
  @IsOptional()
  guestConnectionId?: string;

  @IsDateString()
  @IsOptional()
  sessionStartedFrom?: Date;

  @IsDateString()
  @IsOptional()
  sessionStartedTo?: Date;

  @IsDateString()
  @IsOptional()
  sessionFinishedFrom?: Date;

  @IsDateString()
  @IsOptional()
  sessionFinishedTo?: Date;

  @IsOptional()
  pageIndex?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  paginate?: boolean = true;
}

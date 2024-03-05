import { IsOptional } from 'class-validator';
import { Guest } from 'src/modules/guests/entities/guest.entity';

export class GetRecordingsDto {
  @IsOptional()
  guestUuid?: Guest;

  @IsOptional()
  agentUuid?: string;

  @IsOptional()
  fromDate?: Date;

  @IsOptional()
  toDate?: Date;

  @IsOptional()
  id?: string;

  @IsOptional()
  callRecordId?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  agentConnectionId?: string;

  @IsOptional()
  guestConnectionId?: string;

  @IsOptional()
  pageIndex?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  direction?: string;

  @IsOptional()
  folio?: string;

  @IsOptional()
  active?: string;
}

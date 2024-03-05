import { IsOptional } from 'class-validator';

export class GetGuestsDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  pageIndex?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  paginate?: boolean = true;

  @IsOptional()
  roleId: string;
}

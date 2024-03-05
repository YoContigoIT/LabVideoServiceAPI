import { IsOptional } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  pageIndex?: number;

  @IsOptional()
  paginate?: boolean = true;
}

import { IsOptional, IsString } from 'class-validator';

export class ListAgentsConnectionsDto {
  @IsOptional()
  @IsString()
  uuid: string;
}

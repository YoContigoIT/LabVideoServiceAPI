import { IsDate, IsOptional, IsString } from 'class-validator';

const now = new Date();
const initialDate = new Date();
initialDate.setDate(initialDate.getDate() - 31);

export class DashboardGraphCallRecordQueryDto {
  @IsString()
  @IsOptional()
  agentConnectionId: string;

  @IsDate()
  @IsOptional()
  initialDate: Date = initialDate;

  @IsDate()
  @IsOptional()
  finalDate: Date = now;
}

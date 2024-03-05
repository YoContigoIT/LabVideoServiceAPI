import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectAdminDto {
  @IsNotEmpty()
  @IsString()
  socketId: string;
}

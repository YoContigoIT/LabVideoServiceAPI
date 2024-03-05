import { IsNotEmpty } from 'class-validator';

export class RefuseCallDto {
  @IsNotEmpty()
  requeue?: boolean;
}

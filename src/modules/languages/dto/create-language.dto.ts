import { IsNotEmpty } from 'class-validator';

export class CreateLanguageDto {
  @IsNotEmpty()
  title: string;
}

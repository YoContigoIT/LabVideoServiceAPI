import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Language } from 'src/modules/languages/entities/language.entity';

export class CreateGuestDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsObject()
  details?: any;

  @IsNotEmpty()
  gender?: string;

  @IsNotEmpty()
  @IsArray()
  languages?: Language[];
}

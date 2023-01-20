import { PartialType } from '@nestjs/mapped-types';
import { CreateGuestsConnectionDto } from './create-guests-connection.dto';

export class UpdateGuestsConnectionDto extends PartialType(CreateGuestsConnectionDto) {
  id: number;
}

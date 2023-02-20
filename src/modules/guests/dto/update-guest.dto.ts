import { PartialType } from '@nestjs/mapped-types';
import { IsJSON, IsObject, IsString } from 'class-validator';
import { CreateGuestDto } from './create-guest.dto';

export class UpdateGuestDto extends PartialType(CreateGuestDto) {
    @IsString()
    name?: string

    @IsObject()
    details?: any
}

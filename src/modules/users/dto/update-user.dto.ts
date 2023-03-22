import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/modules/user-roles/entities/user-role.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    names: string;

    @IsString()
    lastnames: string;

    @IsString()
    email: string;

    @IsString()
    role: UserRole;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordUserDto {
    @IsNotEmpty()
    @IsString()
    password: string;
}

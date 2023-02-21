import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordAgentDto {
    @IsNotEmpty()
    @IsString()
    password: string;
}

import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Guest } from "src/guests/entities/guest.entity";
import { Column } from "typeorm";

export class CreateGuestsConnectionDto {
    @IsOptional()
    uuid: Guest

    @IsNotEmpty()
    socketId: string

    @IsOptional()
    ip: string;

    @IsOptional()
    typeClientBrowser: string;

    @IsString()
    @IsNotEmpty()
    priority: string
}

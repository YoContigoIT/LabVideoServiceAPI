import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Guest } from "src/modules/guests/entities/guest.entity";
import { Column } from "typeorm";

export class CreateGuestsConnectionDto {
    @IsOptional()
    uuid: Guest

    @IsOptional()
    ip?: string;

    @IsOptional()
    typeClientBrowser: string;

    @IsString()
    @IsOptional()
    priority: string

    @IsOptional()
    latitude

    @IsOptional()
    longitude

    @IsOptional()
    altitude

    @IsOptional()
    folio: string

    @IsOptional()
    endTimeConnection: Date

    @IsOptional()
    details: JSON

    @IsOptional()
    sessionId?: string;
}

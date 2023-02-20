import { IsDate, IsNotEmpty, IsOptional, IsString, isString } from "class-validator";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

export class ListAgentsConnectionsDto {
    @IsOptional()
    @IsString()
    uuid: string;
}

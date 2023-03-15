import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { Agent } from "src/modules/agent/entities/agent.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

export class CreateAgentsConnectionDto {
    @IsNotEmpty()
    agent: Agent;

    @IsOptional()
    ip?: string;

    @IsOptional()
    typeClientBrowser?: string;
}

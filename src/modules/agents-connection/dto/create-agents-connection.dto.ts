import { IsDate, IsNotEmpty } from "class-validator";
import { Agent } from "src/modules/agent/entities/agent.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

export class CreateAgentsConnectionDto {
    @IsNotEmpty()
    agent: Agent;

    @Column()
    ip?: string;

    @Column()
    typeClientBrowser?: string;
}

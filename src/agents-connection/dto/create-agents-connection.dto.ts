import { IsDate, IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

export class CreateAgentsConnectionDto {
    @IsNotEmpty()
    uuid: User;

    @IsNotEmpty()
    socketId: string;

    @Column()
    ip?: string;

    @Column()
    typeClientBrowser?: string;
}

import { IsDate, IsNotEmpty } from "class-validator";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

export class CreateAgentsConnectionDto {
    @IsNotEmpty()
    user: User;

    @Column()
    ip?: string;

    @Column()
    typeClientBrowser?: string;
}

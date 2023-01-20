import { ValidateIf } from "class-validator";
import { Role } from "src/auth/auth.interfaces";
import { AgentsConnection } from "src/agents-connection/entities/agents-connection.entity";
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, OneToMany } from "typeorm";

@Entity()
export class User {
    @OneToMany(() => AgentsConnection, (agentsConnection) => agentsConnection.uuid)
    @PrimaryGeneratedColumn("uuid")
    uuid: string

    @Column()
    names: string

    @Column()
    lastnames: string

    @Column({nullable: true})
    password?: string

    @Column({unique:true, nullable: true})
    email?: string

    @Column()
    role: string

    @DeleteDateColumn()
    deleteAt: Date;
}
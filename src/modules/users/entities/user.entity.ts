import { ValidateIf } from "class-validator";
import { Role } from "src/modules/auth/auth.interfaces";
import { AgentsConnection } from "src/modules/agents-connection/entities/agents-connection.entity";
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, OneToMany } from "typeorm";
import { Exclude, Expose } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    uuid: string

    @Column()
    names: string

    @Column()
    lastnames: string

    @Column({nullable: true})
    @Exclude()
    password?: string

    @Column({unique:true, nullable: true})
    email?: string

    @Column()
    role: string

    @DeleteDateColumn()
    deleteAt: Date;

    @OneToMany(() => AgentsConnection, (agentsConnection) => agentsConnection.user)
    agentsConnection: AgentsConnection[]

    @Expose()
    get fullName(): string {
        return `${this.names} ${this.lastnames}`;
    }
}
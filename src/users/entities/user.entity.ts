import { ValidateIf } from "class-validator";
import { Role } from "src/auth/auth.interfaces";
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class User {
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
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    uuid: string

    @Column()
    names: string

    @Column()
    lastnames: string

    @Column()
    password: string

    @Column({unique:true})
    email: string

    @Column()
    role: string

    @DeleteDateColumn()
    deleteAt: Date;
}
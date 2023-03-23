
import { Agent } from "src/modules/agent/entities/agent.entity";
import { Guest } from "src/modules/guests/entities/guest.entity";
import { Column, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Language {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    title: string

    @ManyToMany(() => Agent, (agent) => agent.languages, {})
    agents?: Agent[]

    @ManyToMany(() => Guest, (guest) => guest.languages, {})
    guests?: Guest[]

    @DeleteDateColumn()
    deleteAt?: Date
}

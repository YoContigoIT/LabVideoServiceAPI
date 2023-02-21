
import { Agent } from "src/modules/agent/entities/agent.entity";
import { Column, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Language {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    title: string

    @ManyToMany(() => Agent, (agent) => agent.languages, {})
    agents: Agent[]

    @DeleteDateColumn()
    deleteAt: Date
}

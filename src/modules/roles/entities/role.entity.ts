import { Agent } from "src/modules/agent/entities/agent.entity"
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    @OneToMany(() => Agent, (agent) => agent.role)
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @DeleteDateColumn()
    deleteAt: Date

    @OneToMany(() => Agent, (agent) => agent.role)
    agents: Agent[]
}

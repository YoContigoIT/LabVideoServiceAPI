import { Agent } from "src/modules/agent/entities/agent.entity";
import { Language } from "src/modules/languages/entities/language.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

// @Entity()
export class AgentsLanguage {
    // @PrimaryGeneratedColumn()
    // id: string

    @Column({ name: 'agentUuid' })
    agentUuid: string
    
    @Column({ name: 'languageId' })
    languagesId: string
    
    @ManyToOne(() => Language, (language) => language.agents,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    languages: Language[]
    
    @ManyToOne(() => Agent, (agent) => agent.languages,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    agents: Agent[]
}

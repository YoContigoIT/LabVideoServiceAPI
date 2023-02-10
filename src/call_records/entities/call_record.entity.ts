import { IsJSON } from "class-validator";
import { AgentsConnection } from "src/agents-connection/entities/agents-connection.entity";
import { GuestsConnection } from "src/guests-connection/entities/guests-connection.entity";
import { Recording } from "src/recordings/entities/recording.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CallRecord {
    @PrimaryGeneratedColumn()
    @OneToMany(() => Recording, (recording) => recording.callRecordId)
    id: number

    @ManyToOne(() => AgentsConnection, (agentConnection) => agentConnection.id)
    @JoinColumn({ name: 'agentConnectionId' })
    agentConnectionId: AgentsConnection

    @ManyToOne(() => GuestsConnection, (guestConnection) => guestConnection.id)
    @JoinColumn({ name: 'guestConnectionId' })
    guestConnectionId: GuestsConnection

    @Column('json', { nullable: true })
    @IsJSON()
    details: any

    @CreateDateColumn()
    sessionStartedAt: Date

    @Column({ nullable: true, type: "datetime" })
    sessionFinishedAt: Date
}

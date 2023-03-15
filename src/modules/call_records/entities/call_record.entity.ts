import { IsJSON } from "class-validator";
import { AgentsConnection } from "src/modules/agents-connection/entities/agents-connection.entity";
import { GuestsConnection } from "src/modules/guests-connection/entities/guests-connection.entity";
import { Recording } from "src/modules/recordings/entities/recording.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CallRecord {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => AgentsConnection, (agentConnection) => agentConnection.id,
    { eager: true })
    @JoinColumn({ name: 'agentConnectionId' })
    agentConnectionId: AgentsConnection

    @ManyToOne(() => GuestsConnection, (guestConnection) => guestConnection.id,
    { eager: true })
    @JoinColumn({ name: 'guestConnectionId' })
    guestConnectionId: GuestsConnection

    @Column('json', { nullable: true })
    @IsJSON()
    details: any

    @CreateDateColumn()
    sessionStartedAt: Date

    @Column({ nullable: true, type: "datetime" })
    sessionFinishedAt: Date

    @OneToOne(() => Recording, (recording) => recording.callRecordId)
    recording: Recording
}

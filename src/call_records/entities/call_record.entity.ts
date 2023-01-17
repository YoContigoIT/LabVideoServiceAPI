import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CallRecord {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    uuidAgent: string

    @Column()
    sessionName: string

    @CreateDateColumn()
    sessionStartedAt: Date

    @CreateDateColumn()
    sessionFinishedAt: Date

    @Column()
    ip: string
}

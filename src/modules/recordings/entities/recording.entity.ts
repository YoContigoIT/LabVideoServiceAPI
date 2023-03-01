import { CallRecord } from "src/modules/call_records/entities/call_record.entity";
import { Column, JoinColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recording {
    @PrimaryGeneratedColumn()
    id: string

    @Column({ nullable: true })
    uri: string

    @Column({ nullable: true })
    sessionId: string

    @ManyToOne(() => CallRecord, (callRecord) => callRecord.id,
    { eager: true })
    @JoinColumn({ name: "callRecordId" })
    callRecordId: CallRecord

    @Column({ nullable: true })
    duration: number

    @DeleteDateColumn()
    deleteAt: Date
}

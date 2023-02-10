import { CallRecord } from "src/call_records/entities/call_record.entity";
import { Column, JoinColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recording {
    @PrimaryGeneratedColumn()
    id: string

    @Column({ nullable: true })
    uri: string

    @ManyToOne(() => CallRecord, (callRecord) => callRecord.id)
    @JoinColumn({ name: "callRecordId" })
    callRecordId: string

    @DeleteDateColumn()
    deleteAt: Date
}

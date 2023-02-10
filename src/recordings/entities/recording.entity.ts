import { CallRecord } from "src/call_records/entities/call_record.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recording {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    uri: string

    @OneToMany(() => CallRecord, (callRecord) => callRecord.id)
    @Column({ name: "callRecordId" })
    callRecordId: string

    @DeleteDateColumn()
    deleteAt: Date
}

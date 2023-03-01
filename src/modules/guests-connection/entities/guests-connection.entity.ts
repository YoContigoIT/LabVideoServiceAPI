import { CallRecord } from "src/modules/call_records/entities/call_record.entity";
import { Guest } from "src/modules/guests/entities/guest.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GuestsConnection {
    @OneToMany(() => CallRecord, (callRecord) => callRecord.guestConnectionId)
    @PrimaryGeneratedColumn()
    id: string

    @CreateDateColumn()
    startTimeConnection: Date

    @Column({ nullable: true })
    endTimeConnection: Date

    @Column({ nullable: true })
    answer: string

    @Column()
    priority: string

    @ManyToOne(() => Guest, (guest) => guest.uuid,
    { eager: true })
    @JoinColumn({ name: 'uuid' })
    uuid: Guest

    @DeleteDateColumn()
    deleteAt: Date
}   

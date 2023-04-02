import { IsJSON } from "class-validator";
import { CallRecord } from "src/modules/call_records/entities/call_record.entity";
import { Guest } from "src/modules/guests/entities/guest.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Double, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GuestsConnection {
    @PrimaryGeneratedColumn()
    id: string

    @CreateDateColumn()
    startTimeConnection: Date

    @Column({ nullable: true })
    endTimeConnection: Date

    @Column({ nullable: true })
    answer: Date

    @Column()
    priority: string

    @ManyToOne(() => Guest, (guest) => guest.uuid,
    { eager: true })
    @JoinColumn({ name: 'uuid' })
    uuid: Guest

    @Column({ nullable: true })
    folio: string

    @Column({ type: 'double', nullable: true })
    latitude
    
    @Column({ type: 'double', nullable: true })
    longitude
    
    @Column({ type: 'double', nullable: true })
    altitude

    @OneToOne(() => CallRecord, (callRecord) => callRecord.guestConnectionId)
    callRecord: CallRecord

    @Column()
    ip: string
    
    @DeleteDateColumn()
    deleteAt: Date

    @Column('json', { nullable: true })
    @IsJSON()
    details?: any
}   

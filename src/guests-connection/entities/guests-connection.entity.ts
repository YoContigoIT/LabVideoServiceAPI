import { Guest } from "src/guests/entities/guest.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GuestsConnection {
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

    @ManyToOne(() => Guest, (guest) => guest.uuid)
    @JoinColumn({ name: 'uuid' })
    uuid: Guest

    @DeleteDateColumn()
    deleteAt: Date
}   

import { RecordingsMarkType } from "src/modules/recordings-mark-type/entities/recordings-mark-type.entity";
import { Recording } from "src/modules/recordings/entities/recording.entity";
import { Column, JoinColumn, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecordingMark {
    @PrimaryGeneratedColumn()
    id: string

    @ManyToOne(() => RecordingsMarkType, (recordingMarkType) => recordingMarkType.id)
    @JoinColumn({ name: "recordingMarkTypeId" })
    recordingMarkTypeId: string

    @Column()
    markTime: string

    @Column({ nullable: true })
    messageText: string

    @ManyToOne(() => Recording, (recordings) => recordings.id)
    @JoinColumn({ name: "recordingId" })
    recordingId: string

    @DeleteDateColumn()
    deleteAt: Date
}

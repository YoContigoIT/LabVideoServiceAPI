import { RecordingsMarkType } from "src/recordings-mark-type/entities/recordings-mark-type.entity";
import { Recording } from "src/recordings/entities/recording.entity";
import { Column, JoinColumn, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecordingMark {
    @PrimaryGeneratedColumn()
    id: string

    @OneToOne(() => RecordingsMarkType, (recordingsMarkType) => recordingsMarkType.id)
    @JoinColumn({ name: "recordingsMarkTypeId" })
    typeId: string

    @Column()
    markTime: string

    @ManyToOne(() => Recording, (recordings) => recordings.id)
    @JoinColumn({ name: "recordingId" })
    recordingId: string

    @DeleteDateColumn()
    deleteAt: Date
}

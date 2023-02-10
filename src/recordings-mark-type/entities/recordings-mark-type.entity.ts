import { RecordingMark } from "src/recording-mark/entities/recording-mark.entity";
import { Column, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecordingsMarkType {
    @OneToOne(() => RecordingMark, (recordingMark) => recordingMark.typeId)
    @PrimaryGeneratedColumn()
    id?: string

    @Column()
    type: string

    @Column()
    typeTitle: string

    @DeleteDateColumn()
    deleteAt?: Date
}

import { RecordingMark } from "src/modules/recording-mark/entities/recording-mark.entity";
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecordingsMarkType {
    @OneToMany(() => RecordingMark, (recordingMark) => recordingMark.recordingMarkTypeId)
    @JoinTable()
    @PrimaryGeneratedColumn()
    id: string

    @Column({ nullable: true })
    type: string

    @Column()
    typeTitle: string

    @DeleteDateColumn()
    deleteAt?: Date
}

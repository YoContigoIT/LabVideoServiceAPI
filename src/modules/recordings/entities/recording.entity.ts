import { CallRecord } from 'src/modules/call_records/entities/call_record.entity';
import { RecordingMark } from 'src/modules/recording-mark/entities/recording-mark.entity';
import {
  Column,
  JoinColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Recording {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  uri: string;

  @Column({ nullable: true })
  sessionId: string;

  @ManyToOne(() => CallRecord, (callRecord) => callRecord.id, { eager: true })
  @JoinColumn({ name: 'callRecordId' })
  callRecordId: CallRecord;

  @OneToMany(() => RecordingMark, (recordinMark) => recordinMark.recordingId)
  recordingMarks: RecordingMark[];

  @Column({ nullable: true })
  duration: number;

  @DeleteDateColumn()
  deleteAt: Date;
}

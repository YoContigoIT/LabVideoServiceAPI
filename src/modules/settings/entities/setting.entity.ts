import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ nullable: true })
  openViduRecord?: boolean;

  @Column({ nullable: true })
  openViduRecordingMode?: string;

  @Column({ nullable: true })
  openViduRecordingWidth?: number;

  @Column({ nullable: true })
  openViduRecordingHeight?: number;

  @Column({ nullable: true })
  openViduRecordingLayout?: string;

  @Column({ nullable: true })
  openViduRecordingFrameRate: number;
}

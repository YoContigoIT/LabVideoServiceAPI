import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/modules/user-roles/entities/user-role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  names: string;

  @Column()
  lastnames: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @ManyToOne(() => UserRole, (userRole) => userRole.id, { eager: true })
  @JoinColumn({ name: 'roleId' })
  roleId: UserRole;

  @DeleteDateColumn()
  deleteAt: Date;

  // @OneToMany(() => AgentsConnection, (agentsConnection) => agentsConnection.user)
  // agentsConnection: AgentsConnection[]

  @Expose()
  get fullName(): string {
    return `${this.names} ${this.lastnames}`;
  }
}

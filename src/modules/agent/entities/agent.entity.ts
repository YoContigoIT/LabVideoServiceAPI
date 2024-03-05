import { Expose } from 'class-transformer';
import { AgentsConnection } from 'src/modules/agents-connection/entities/agents-connection.entity';
import { Language } from 'src/modules/languages/entities/language.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  names: string;

  @Column()
  lastnames: string;

  // @Column({nullable: true})
  // @Exclude()
  // password?: string

  @Column({ unique: true, nullable: true })
  email?: string;

  @ManyToOne(() => Role, (role) => role.id, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ nullable: true })
  sex: string;

  @DeleteDateColumn()
  deleteAt: Date;

  @OneToMany(
    () => AgentsConnection,
    (agentsConnection) => agentsConnection.agent,
  )
  agentsConnection: AgentsConnection[];

  @ManyToMany(() => Language, (language) => language.agents, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  @JoinTable({ name: 'agent_languages' })
  languages: Language[];

  @Expose()
  get fullName(): string {
    return `${this.names} ${this.lastnames}`;
  }
}

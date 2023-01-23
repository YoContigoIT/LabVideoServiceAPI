import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class AgentsConnection {
    @PrimaryGeneratedColumn()
    id: string

    @CreateDateColumn()
    startTimeConnection: Date

    @Column({ nullable: true })
    endTimeConnection: Date

    @Column({ nullable: true })
    ip: string

    @Column({ nullable: true })
    typeClientBrowser: string

    @ManyToOne(() => User, (user) => user.uuid)
    @JoinColumn({ name: 'userUUID' })
    user: User

    @DeleteDateColumn()
    deleteAt: Date
}

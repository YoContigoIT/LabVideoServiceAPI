
import { User } from "src/modules/users/entities/user.entity"
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @DeleteDateColumn()
    deleteAt: Date

    @OneToMany(() => User, (user) => user.roleId)
    users: User[]
}

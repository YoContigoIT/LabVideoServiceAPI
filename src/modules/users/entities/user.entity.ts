import { ValidateIf } from "class-validator";
import { Role } from "src/modules/auth/auth.interfaces";
import { AgentsConnection } from "src/modules/agents-connection/entities/agents-connection.entity";
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn, JoinTable, EntityManager } from "typeorm";
import { Exclude, Expose } from "class-transformer";
import { UserRole } from "src/modules/user-roles/entities/user-role.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    uuid: string

    @Column()
    names: string

    @Column()
    lastnames: string

    @Column({nullable: true})
    @Exclude()
    password?: string

    @Column({unique:true, nullable: true})
    email?: string

    @ManyToOne(() => UserRole, (userRole) => userRole.id, { eager: true })
    @JoinColumn({ name: 'roleId' })
    roleId: UserRole

    @DeleteDateColumn()
    deleteAt: Date;

    // @OneToMany(() => AgentsConnection, (agentsConnection) => agentsConnection.user)
    // agentsConnection: AgentsConnection[]

    @Expose()
    get fullName(): string {
        return `${this.names} ${this.lastnames}`;
    }
}
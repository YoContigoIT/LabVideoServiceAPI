import { IsJSON, IsString, IS_JSON } from "class-validator";
import { GuestsConnection } from "src/modules/guests-connection/entities/guests-connection.entity";
import { Language } from "src/modules/languages/entities/language.entity";
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Guest {
    @PrimaryGeneratedColumn('uuid')
    uuid: string

    @Column({ nullable: true })
    @IsString()
    name?: string

    @Column('json', { nullable: true })
    @IsJSON()
    details?: any

    @Column()
    gender?: string

    @ManyToMany(() => Language, (language) => language.guests,
    { cascade: ["insert", "update", "remove"], eager: true })
    @JoinTable({ name: "guest_languages" })
    languages?: Language[];
    
    @DeleteDateColumn()
    deleteAt: Date
    
    @OneToMany(() => GuestsConnection, (guestsConnection) => guestsConnection.uuid)
    guestConnections: GuestsConnection[]
}

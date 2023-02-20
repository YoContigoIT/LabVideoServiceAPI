import { IsJSON, IsString, IS_JSON } from "class-validator";
import { GuestsConnection } from "src/modules/guests-connection/entities/guests-connection.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Guest {
    @OneToMany(() => GuestsConnection, (guestsConnection) => guestsConnection.uuid)
    @PrimaryGeneratedColumn('uuid')
    uuid: string

    @Column({ nullable: true })
    @IsString()
    name: string

    @Column('json', { nullable: true })
    @IsJSON()
    details: any

    @DeleteDateColumn()
    deleteAt: Date
}

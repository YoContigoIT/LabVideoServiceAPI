import { IsJSON, IsString, IS_JSON } from "class-validator";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Guest {
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

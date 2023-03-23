import { IsJSON } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class ApiKey {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Exclude()
    apikey: string

    @Column({ type: 'enum', enum: ['secret', 'public'] })
    type: string

    @DeleteDateColumn()
    deleteAt: Date

    @Column()
    clientId: string

    @CreateDateColumn()
    createAt: Date

    @Column('json', { nullable: true })
    @IsJSON()
    details?: any
}

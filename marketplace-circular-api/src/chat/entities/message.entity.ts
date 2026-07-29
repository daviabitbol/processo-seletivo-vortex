import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('message')
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    room!: string;

    @Column()
    senderId!: string;

    @Column()
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

}
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "@entity/User";

@Entity('setting')
export class Setting extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    alarm_type: string;

    @Column()
    music_title: string;

    @Column({ default: 10 })
    volume: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @OneToOne(() => User, (user) => user.setting, {createForeignKeyConstraints: false})
    user: User;
}
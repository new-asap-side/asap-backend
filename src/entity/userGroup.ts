import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "@entity/user";
import {Group} from "@entity/group";
import { BaseEntity } from '@entity/base';

@Entity('user_group')
export class UserGroup extends BaseEntity{
    @Column()
    user_id: number;

    @Column()
    group_id: number;

    @Column()
    alarm_type: string;

    @Column()
    music_title: string;

    @Column({ default: 10 })
    volume: number;

    // Relations
    @ManyToOne(() => User, (user) => user.userGroups)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Group, (group) => group.userGroups)
    @JoinColumn({ name: 'group_id' })
    group: Group;
}
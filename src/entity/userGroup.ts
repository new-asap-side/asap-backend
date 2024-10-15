import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import { BaseEntity } from '@src/entity/base';
import { User } from '@src/entity/user';
import { Group } from '@src/entity/group';

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
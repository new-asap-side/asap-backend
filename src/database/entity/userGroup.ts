import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@src/database/entity/base';
import { User } from '@src/database/entity/user';
import { Group } from '@src/database/entity/group';

export enum AlarmTypeEnum {
    'sound'='SOUND',
    'vibration'='VIBRATION',
    'all'='ALL'
}

@Entity('user_group')
export class UserGroup extends BaseEntity{
    @PrimaryGeneratedColumn()
    user_group_id: number;

    @Column()
    user_id: number;

    @Column()
    group_id: number;

    @Column({type: 'enum', enum: AlarmTypeEnum})
    alarm_type: AlarmTypeEnum;

    @Column()
    music_title: string;

    @Column({ default: 10 })
    volume: number;

    @Column({ default: 0 })
    alarm_unlock_count: number // 알람해제수

    @Column({ default: 0 })
    view_count: number // 그룹상세 조회수

    @Column()
    is_group_master: boolean

    // Relations
    @ManyToOne(() => User, (user) => user.userGroups)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Group, (group) => group.userGroups)
    @JoinColumn({ name: 'group_id' })
    group: Group;
}
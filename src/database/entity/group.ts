import {
    Column,
    Entity,
    OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import {Exclude} from "class-transformer";
import { BaseEntity } from '@src/database/entity/base';
import { AlarmUnlockContentsEnum, UserGroup } from '@src/database/entity/userGroup';
import { AlarmDayEnum } from '@src/dto/dto.group';
import { Alarm } from '@src/database/entity/alarm';

export enum GroupStatusEnum {
    'live'='LIVE', // 그룹이 살아있는경우
    'removed'='REMOVED', // 그룹이 알람종료일이 되어 제거된 경우
}

@Entity('group')
export class Group extends BaseEntity{
    @PrimaryGeneratedColumn()
    group_id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    max_person: number;

    @Column({default: 0})
    current_person: number;

    @Column()
    is_public: boolean;

    @Exclude()
    @Column({ length: 4, nullable: true })
    group_password: string;

    @Column({ nullable: true, comment: '알람 종료 날짜' })
    alarm_end_date: string;

    @Column({ nullable: true, comment: '알람 시간' })
    alarm_time: string;

    @Column({default: 0})
    view_count: number;

    @Column({nullable: true})
    group_thumbnail_image_url: string;

    @Column({ type: 'enum', enum: GroupStatusEnum })
    status: GroupStatusEnum;

    @Column({type: 'enum', enum: AlarmUnlockContentsEnum})
    alarm_unlock_contents: AlarmUnlockContentsEnum;

    // Relations
    @OneToMany(() => Alarm, (alarm) => alarm.alarm_day)
    alarm_days: Alarm[];

    @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
    userGroups: UserGroup[];
}
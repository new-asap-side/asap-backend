import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@src/database/entity/base';
import { UserGroup } from '@src/database/entity/userGroup';
import { Alarm } from '@src/database/entity/alarm';
import { AlarmUnlockContentsEnum } from '@src/database/enum/alarmUnlockContentsEnum';
import { GroupStatusEnum } from '@src/database/enum/groupStatusEnum';
import { Report } from '@src/database/entity/report';

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

    @Column({default: 1})
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

    @OneToMany(() => Alarm, (alarm) => alarm.alarm_day)
    alarm_days: Alarm[];

    @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
    userGroups: UserGroup[];

    @OneToMany(() => Report, (reports) => reports.group)
    reports: Report[];

    @DeleteDateColumn({type: 'datetime'})
    deleted_at: Date;
}
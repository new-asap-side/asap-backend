import {
    Column,
    Entity,
    OneToMany,
} from "typeorm";
import {Exclude} from "class-transformer";
import { BaseEntity } from '@src/database/entity/base';
import { UserGroup } from '@src/database/entity/userGroup';

export enum GroupStatusEnum {
    'live'='live', // 그룹이 살아있는경우
    'removed'='removed', // 그룹이 알람종료일이 되어 제거된 경우
}

@Entity('group')
export class Group extends BaseEntity{
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

    @Column({ type: 'date', nullable: true, comment: '알람 종료 날짜' })
    alarm_end_date: Date;

    @Column({ type: 'time', nullable: true, comment: '알람 시간 ' })
    alarm_hour_min: string;

    // Redis bull로 기능 구현할꺼라 필요없음
    // @Column({type:'json', nullable: true, comment: '알람이 울려야하는 날짜 배열 [YYYY.MM.DD HH:mm, ...]' })
    // alarm_date: string[];

    @Column()
    view_count: number;

    @Column({ type: 'enum', enum: GroupStatusEnum })
    status: GroupStatusEnum;

    // Relations
    @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
    userGroups: UserGroup[];
}
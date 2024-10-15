import {
    Column,
    Entity,
    OneToMany,
} from "typeorm";
import {Exclude} from "class-transformer";
import { BaseEntity } from '@src/entity/base';
import { UserGroup } from '@src/entity/userGroup';

@Entity('group')
export class Group extends BaseEntity{
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    max_person: number;

    @Column()
    current_person: number;

    @Column()
    is_public: boolean;

    @Exclude()
    @Column({ length: 4, nullable: true })
    group_password: string;

    // TODO: 알람이 울려야하는 시점을 서버에서 저장할 필요가 있을지 논의 필요
    // @Column({ type: 'date', nullable: true })
    // alarm_deadline: string;
    //
    // @Column({ type: 'time', nullable: true })
    // alarm_hour_min: string;
    //
    // @Column('json', { nullable: true })
    // alarm_date: string[];

    @Column()
    view_count: number;

    @Column()
    status: string;

    @Column()
    alarm_unlock_type: string;

    // Relations
    @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
    userGroups: UserGroup[];
}
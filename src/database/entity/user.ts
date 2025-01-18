import {
    Column, DeleteDateColumn,
    Entity, Index,
    OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '@src/database/entity/base';
import { UserGroup } from '@src/database/entity/userGroup';
import { Report } from '@src/database/entity/report';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ unique: true, nullable: true })
    @Index()
    kakao_id: string;

    @Column({ unique: true, nullable: true })
    @Index()
    apple_id: string;

    @Column({nullable: true})
    nick_name: string;

    @Column({nullable: true})
    profile_image_url: string;

    @Column({nullable: true})
    @Index()
    refresh_token: string;

    @Column({default: 0})
    ranking_page_view_count: number // 랭킹페이지 조회수

    @Column({nullable: true})
    user_leave_reason: string

    @Column({nullable: true})
    fcm_token: string

    @Column({nullable: true})
    device_token: string

    @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
    userGroups: UserGroup[];

    @OneToMany(() => Report, (reports) => reports.user)
    reports: Report[];

    @DeleteDateColumn({type: 'datetime'})
    deleted_at: Date;
}
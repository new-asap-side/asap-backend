import {
    Column,
    Entity,
    OneToMany
} from "typeorm";
import { BaseEntity } from '@src/database/entity/base';
import { UserGroup } from '@src/database/entity/userGroup';

@Entity('user')
export class User extends BaseEntity {
    @Column({ unique: true, nullable: true })
    kakao_id: string;

    @Column({ unique: true, nullable: true })
    apple_id: string;

    @Column({nullable: true})
    nick_name: string;

    @Column({nullable: true})
    profile_image_url: string;

    @Column({nullable: true})
    score: string;

    @Column({nullable: true})
    refresh_token: string;

    @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
    userGroups: UserGroup[];
}
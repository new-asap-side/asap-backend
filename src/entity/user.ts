import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserGroup} from "@entity/userGroup";
import { BaseEntity } from '@entity/base';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
    userGroups: UserGroup[];
}
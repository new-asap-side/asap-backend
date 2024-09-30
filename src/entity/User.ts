import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Setting} from "@entity/Setting";
import {UserGroup} from "@entity/UserGroup";

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    setting_id: number;

    @Column({ nullable: true })
    kakao_id: string;

    @Column({ nullable: true })
    apple_id: string;

    @Column()
    nick_name: string;

    @Column()
    profile_image_url: string;

    @Column()
    score: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @OneToOne(() => Setting, (setting) => setting.user)
    @JoinColumn({ name: 'setting_id' })
    setting: Setting;

    @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
    userGroups: UserGroup[];
}
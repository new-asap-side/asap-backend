import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Setting} from "@entity/Setting";
import {UserGroup} from "@entity/UserGroup";
import {Exclude} from "class-transformer";

@Entity('group')
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column()
    group_is_deadline: boolean;

    @Column({ type: 'date', nullable: true })
    alarm_deadline: string;

    @Column()
    alarm_is_am: boolean;

    @Column({ type: 'time', nullable: true })
    alarm_hour_min: string;

    @Column('json', { nullable: true })
    alarm_date: string[];

    @Column()
    view_count: number;

    @Column()
    status: string;

    @Column()
    alarm_unlock_type: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
    userGroups: UserGroup[];
}
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@src/database/entity/base';
import { User } from '@src/database/entity/user';
import { Group } from '@src/database/entity/group';

@Entity('report')
export class Report extends BaseEntity{
    @PrimaryGeneratedColumn()
    report_id: number;

    @Column()
    user_id: number;

    @Column()
    group_id: number;

    // Relations
    @ManyToOne(() => User, (user) => user.reports)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Group, (group) => group.reports)
    @JoinColumn({ name: 'group_id' })
    group: Group;
}
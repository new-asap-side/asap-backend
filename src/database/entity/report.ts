import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@src/database/entity/base';
import { User } from '@src/database/entity/user';
import { Group } from '@src/database/entity/group';

@Entity('report')
@Index(['user_id', 'group_id']) // 복합 인덱스 설정
export class Report extends BaseEntity{
    @PrimaryGeneratedColumn()
    report_id: number;

    @Column()
    @Index()
    user_id: number;

    @Column()
    @Index()
    group_id: number;

    @Column({default: 'EMPTY'})
    reportDetailText: string;

    // Relations
    @ManyToOne(() => User, (user) => user.reports)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Group, (group) => group.reports)
    @JoinColumn({ name: 'group_id' })
    group: Group;
}
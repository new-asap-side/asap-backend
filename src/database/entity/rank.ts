import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@src/database/entity/base';
import { UserGroup } from '@src/database/entity/userGroup';

@Entity('rank')
export class Rank extends BaseEntity{
    @PrimaryGeneratedColumn()
    rank_id: number;

    @Column()
    user_group_id: number;

    @Column({comment: '랭킹등수'})
    rank_number: number;

    @Column({comment: '랭킹점수'})
    rank_score: number;

    // Relations
    @ManyToOne(() => UserGroup, (group) => group.ranks)
    @JoinColumn({ name: 'user_group_id' })
    userGroup: UserGroup;
}
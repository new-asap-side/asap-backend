import {
    Column,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AlarmDayEnum } from '@src/dto/dto.group';
import { Group } from '@src/database/entity/group';

@Entity('alarm')
export class Alarm {
    @PrimaryGeneratedColumn()
    alarm_id: number;

    @Column()
    group_id: number

    @Column({ type: 'enum', enum: AlarmDayEnum })
    @ManyToOne(() => Group, (group) => group.alarm_days)
    @JoinColumn({ name: 'group_id' })
    alarm_day: AlarmDayEnum;
}
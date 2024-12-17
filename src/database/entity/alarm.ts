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

    @ManyToOne(() => Group, (group) => group.alarm_days)
    @JoinColumn({ name: 'group_id' })
    group: Group;

    @Column({ type: 'enum', enum: AlarmDayEnum })
    alarm_day: AlarmDayEnum;
}
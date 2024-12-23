import {
    Column,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from '@src/database/entity/group';
import { AlarmDayEnum } from '@src/database/enum/alarmDaysEnum';

@Entity('alarm')
export class Alarm {
    @PrimaryGeneratedColumn()
    alarm_id: number;

    @Column()
    group_id: number

    @ManyToOne(() => Group, (group) => group.alarm_days)
    @JoinColumn({ name: 'group_id' })
    @Column({ type: 'enum', enum: AlarmDayEnum })
    alarm_day: AlarmDayEnum;
}
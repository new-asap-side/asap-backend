import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "@entity/User";
import {Group} from "@entity/Group";

@Entity('user_group')
export class UserGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    group_id: number;

    // Relations
    @ManyToOne(() => User, (user) => user.userGroups)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Group, (group) => group.userGroups)
    @JoinColumn({ name: 'group_id' })
    group: Group;
}
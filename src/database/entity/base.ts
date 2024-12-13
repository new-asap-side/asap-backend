import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
    @CreateDateColumn({type: 'datetime'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime'})
    updated_at: Date;
}
import { CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
    @Index()
    @CreateDateColumn({type: 'datetime'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime'})
    updated_at: Date;
}
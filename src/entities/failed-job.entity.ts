import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('failed_jobs')
export class FailedJob {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column({ type: 'text' })
  connection: string;

  @Column({ type: 'text' })
  queue: string;

  @Column({ type: 'longtext' })
  payload: string;

  @Column({ type: 'longtext' })
  exception: string;

  @CreateDateColumn({ name: 'failed_at' })
  failed_at: Date;
}

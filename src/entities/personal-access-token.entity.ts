import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('personal_access_tokens')
export class PersonalAccessToken {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  tokenable_type: string;

  @Column({ type: 'bigint' })
  tokenable_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'text', nullable: true })
  abilities: string;

  @Column({ nullable: true })
  last_used_at: Date;

  @Column({ nullable: true })
  expires_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

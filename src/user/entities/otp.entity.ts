// src/otp/otp.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  otp: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;
  
  @Column({ default: false })
  isVerified: boolean;
}

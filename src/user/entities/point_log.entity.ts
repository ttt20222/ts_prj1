import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity({
  name: 'point_logs',
})
export class PointLog {
  @PrimaryGeneratedColumn({name: 'log_id'})
  logId: number;

  @Column('int', { name: 'user_id', nullable: false })
  userId: number;

  @Column('int', { name: 'point', nullable: false })
  point: number;

  @CreateDateColumn()
  createdAt: Date;
}
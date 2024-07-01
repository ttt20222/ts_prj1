import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';
import { PointLog } from './point_log.entity';

@Entity({
  name: 'points',
})
export class Point {
  @PrimaryGeneratedColumn({name: 'point_id'})
  pointId: number;

  @OneToOne(() => User, (user) => user.point)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('int', { name: 'point', nullable: false })
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
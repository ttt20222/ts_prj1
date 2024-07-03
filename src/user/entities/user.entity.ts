import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { Point } from './point.entity';
import { Reserve } from 'src/reserve/entities/reserve.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({name: 'user_id'})
  userId: number;

  @IsEmail()
  @IsNotEmpty()
  @Column('varchar', { name: 'email', length: 50, unique: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'password', select: false, nullable: false })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'name', length: 10, nullable: false })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 10, nullable: false })
  nickname: string;

  @Column('boolean', { name: 'is_admin', default: false, nullable: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Point, (point) => point.user)
  point: Point;

  @OneToMany(() => Reserve, (reserve) => reserve.user)
  reserve: Reserve[];
}
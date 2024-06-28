import { IsEmail, IsString } from 'class-validator';
import {
  Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({name: 'user_id'})
  userId: number;

  @IsEmail()
  @Column('varchar', { name: 'email', length: 50, unique: true, nullable: false })
  email: string;

  @IsString()
  @Column('varchar', { name: 'password', length: 10, select: false, nullable: false })
  password: string;

  @IsString()
  @Column('varchar', { name: 'name', length: 10, nullable: false })
  name: string;

  @IsString()
  @Column('varchar', { name: 'nickname', length: 10, nullable: false })
  nickname: string;

  @Column('boolean', { name: 'is_admin', default: false, nullable: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
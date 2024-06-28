import { IsString } from 'class-validator';
import {
  Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @IsString()
  @Column('varchar', { length: 50, nullable: false })
  email: string;

  @IsString()
  @Column('varchar', { length: 10, select: false, nullable: false })
  password: string;

  @IsString()
  @Column('varchar', { length: 10, nullable: false })
  name: string;

  @IsString()
  @Column('varchar', { length: 10, nullable: false })
  nickname: string;

  @Column('boolean', { default: false, nullable: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
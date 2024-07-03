import { IsArray, IsDate, IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Show } from 'src/show/entities/show.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { Status } from '../types/reserve.type';


@Entity({
  name: 'reserves',
})
export class Reserve {
  @PrimaryGeneratedColumn({name: 'reserve_id'})
  reserveId: number;

  @ManyToOne(() => User, (user) => user.reserve)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'ticket_number', nullable: false })
  ticketNumber: string;

  @ManyToOne(() => Show, (show) => show.reserve)
  @JoinColumn({ name: 'show_id' })
  show: Show;

  @Column({ type: 'int', name: 'show_id' })
  showId: number;

  @Column('datetime', { name: 'show_time', nullable: false })
  showTime: Date;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'seat_grade', length : 10, nullable: false })
  seatGrade: string;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'seat_floor', length : 10, nullable: false })
  seatFloor: string;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'seat_row', length : 10, nullable: false })
  seatRow: string;

  @IsNotEmpty()
  @IsInt()
  @Column('int', { name: 'seat_number', nullable: false })
  seatNumber: number;

  @IsNotEmpty()
  @IsInt()
  @Column('int', { name: 'price', nullable: false })
  price: number;

  @IsNotEmpty()
  @IsString()
  @Column('enum', { enum: Status, name: 'status', nullable: false })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
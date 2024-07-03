import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { Hall } from './hall.entity';
import { showSeatMapping } from './showSeatMapping.entity';

@Entity({
  name: 'seats',
})
export class Seat {
  @PrimaryGeneratedColumn({name: 'seat_id'})
  seatId: number;

  @ManyToOne(() => Hall, (hall) => hall.seat)
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @Column({ type: 'int', name: 'hall_id' })
  hallId: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => showSeatMapping, (showseatmapping) => showseatmapping.seat)
  showseatmapping: showSeatMapping[];
}
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { Show } from './show.entity';
import { Seat } from './seat.entity';

@Entity({
  name: 'halls',
})
export class Hall {
  @PrimaryGeneratedColumn({name: 'hall_id'})
  hallId: number;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'hall_name', nullable: false })
  hallName: string;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'address', nullable: false })
  address: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Column('int', { name: 'total_seat_count', nullable: false })
  totalSeatCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Show, (show) => show.hall)
  show: Show[];

  @OneToMany(() => Seat, (seat) => seat.hall)
  seat: Seat[];
}
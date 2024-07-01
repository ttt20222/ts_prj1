import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne,
  PrimaryColumn, 
} from 'typeorm';
import { Show } from './show.entity';
import { showTimeInfo } from './showTimeInfo.entity';
import { Seat } from './seat.entity';

@Entity({
  name: 'show_seat_mapping',
})
export class showSeatMapping {
  @PrimaryColumn('int', { name: 'show_id' })
  showId: number;

  @PrimaryColumn('int', { name: 'show_time_id' })
  showTimeId: number;

  @PrimaryColumn('int', { name: 'seat_id' })
  seatId: number;

  @ManyToOne(() => Show, (show) => show.showseatmapping)
  @JoinColumn({ name: 'show_id' })
  show: Show;

  @ManyToOne(() => showTimeInfo, (showtimeinfo) => showtimeinfo.showseatmapping)
  @JoinColumn({ name: 'show_time_id' })
  showtimeinfo: showTimeInfo;

  @ManyToOne(() => Seat, (seat) => seat.showseatmapping)
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @Column('boolean', { name: 'is_reserved', nullable: false })
  isReserved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
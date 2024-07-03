import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { Show } from './show.entity';
import { showSeatMapping } from './showSeatMapping.entity';

@Entity({
  name: 'show_time_info',
})
export class showTimeInfo {
  @PrimaryGeneratedColumn({name: 'show_time_id'})
  showTimeId: number;

  @ManyToOne(() => Show, (show) => show.showtimeinfo)
  @JoinColumn({ name: 'show_id' })
  show: Show;

  @Column({ type: 'int', name: 'show_id' })
  showId: number;

  @Column('datetime', { name: 'show_time', nullable: false })
  showTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => showSeatMapping, (showseatmapping) => showseatmapping.showtimeinfo)
  showseatmapping: showSeatMapping[];
}
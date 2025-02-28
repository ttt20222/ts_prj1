import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { Category } from '../types/showCategory.type';
import { Status } from '../types/showStatus.type';
import { Image } from './image.entity';
import { showTimeInfo } from './showTimeInfo.entity';
import { showSeatMapping } from './showSeatMapping.entity';
import { Reserve } from 'src/reserve/entities/reserve.entity';
import { Seat } from './seat.entity';

@Entity({
  name: 'shows',
})
export class Show {
  @PrimaryGeneratedColumn({name: 'show_id'})
  showId: number;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'show_name', nullable: false })
  showName: string;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'hall_name', nullable: false })
  hallName: string;

  @IsEnum(Category)
  @IsNotEmpty()
  @Column('enum', { enum: Category , name: 'category', nullable: false })
  category: Category;

  @IsNotEmpty()
  @Column('date', { name: 'start_date', nullable: false })
  startDate: Date;

  @IsNotEmpty()
  @Column('date', { name: 'end_date', nullable: false })
  endDate: Date;

  @IsNotEmpty()
  @Column('varchar', { name: 'runtime', nullable: false })
  runtime: string;

  @IsNotEmpty()
  @Column('text', { name: 'content', nullable: false })
  content: string;

  @IsNotEmpty()
  @IsArray()
  @Column('json', { name: 'seat_info', nullable: false })
  seatInfo: string;

  @IsEnum(Status)
  @IsNotEmpty()
  @Column('enum', { enum: Status , name: 'status', nullable: false })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Image, (image) => image.show)
  image: Image;

  @OneToMany(() => showTimeInfo, (showtimeinfo) => showtimeinfo.show)
  showtimeinfo: showTimeInfo[];

  @OneToMany(() => showSeatMapping, (showseatmapping) => showseatmapping.show)
  showseatmapping: showSeatMapping[];

  @OneToMany(() => Reserve, (reserve) => reserve.show)
  reserve: Reserve[];

  @OneToMany(() => Seat, (seat) => seat.show)
  seat: Seat[];
}
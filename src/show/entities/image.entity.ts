import { IsString } from 'class-validator';
import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { Show } from './show.entity';

@Entity({
  name: 'images',
})
export class Image {
  @PrimaryGeneratedColumn({name: 'image_id'})
  imageId: number;

  @OneToOne(() => Show, (show) => show.image)
  @JoinColumn({ name: 'show_id' })
  show: Show;

  @Column({ type: 'int', name: 'show_id' })
  showId: number;

  @IsString()
  @Column('varchar', { name: 'image_url', nullable: false })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
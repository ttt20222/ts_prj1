import { Injectable } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';

import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';

import { Show } from './entities/show.entity';
import { Hall } from './entities/hall.entity';
import { showTimeInfo } from './entities/showTimeInfo.entity';
import { User } from 'src/user/entities/user.entity';
import { Seat } from './entities/seat.entity';
import { Image } from './entities/image.entity';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    @InjectRepository(Hall)
    private hallRepository: Repository<Hall>,
    @InjectRepository(showTimeInfo)
    private showTimeInfoRepository: Repository<showTimeInfo>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private readonly jwtService: JwtService,
  ) {}

  async createShow(user: User, createShowDto: CreateShowDto) {

    if(user.isAdmin !== true){
      throw new UnauthorizedException(
        '공연 등록 권한이 없습니다.'
      );
    }
    
    const existHall = await this.hallRepository.findOne({
      where: {hallName: createShowDto.hallName}
    })

    if(!existHall) {
      throw new BadRequestException(
        '공연장소가 존재하지 않습니다. 공연장을 먼저 등록해주세요.'
      )
    }

    //공연생성
    const newShow = await this.showRepository.save({
      showName : createShowDto.showName,
      hallName : createShowDto.hallName,
      category : createShowDto.category,
      startDate : createShowDto.startDate,
      endDate : createShowDto.endDate,
      runtime : createShowDto.runtime,
      content : createShowDto.content,
      seatInfo : JSON.stringify(createShowDto.seatInfo),
      status : createShowDto.status,
    })

    //이미지 생성
    await this.imageRepository.save({
      showId: newShow.showId,
      imageUrl : createShowDto.imageUrl,
    })
    
    //좌석 정보 생성
    for (const seat of createShowDto.seatDetailInfo) {
      await this.seatRepository.save({
        hallId: existHall.hallId,
        seatGrade: seat.seatGrade,
        seatFloor: seat.seatFloor,
        seatRow: seat.seatRow,
        seatNumber: seat.seatNumber,
      })
    }

    //공연 회차 정보 생성
    for (const time of createShowDto.showTime) {
      await this.showTimeInfoRepository.save({
        showId: newShow.showId,
        showTime: time,
      });
    }

    return newShow;
  }

  // findAll() {
  //   return `This action returns all show`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} show`;
  // }
}

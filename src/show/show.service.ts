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
import { SearchShowDto } from './dto/search-show.dto';

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

  //공연 생성
  //공연 생성 시, 좌석정보, 회차정보 함꼐 생성
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

//공연 상세조회
  async findOne(id: number) {

    const findShow = await this.showRepository.findOne({
      where: {showId: id},
      select: {
        createdAt: false,
        updatedAt: false,
      },
    });

    return findShow;
  }

  //공연명 검색
  async searchOne(searchShowDto: SearchShowDto) {

    const searchShow = await this.showRepository.query(
      `select show_name, hall_name, category, start_date , end_date ,runtime , content , seat_info , status
      from shows
      where show_name like '%${searchShowDto.showName}%';`
    )

    return searchShow;
  }
}

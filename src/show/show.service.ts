import { Injectable } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';

import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';

import { Show } from './entities/show.entity';
import { Hall } from './entities/hall.entity';
import { showTimeInfo } from './entities/showTimeInfo.entity';
import { User } from 'src/user/entities/user.entity';
import { Seat } from './entities/seat.entity';
import { Image } from './entities/image.entity';
import { SearchShowDto } from './dto/search-show.dto';
import { FindSeatDto } from './dto/find-seat.dto';
import { showSeatMapping } from './entities/showSeatMapping.entity';

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
    @InjectRepository(showSeatMapping)
    private showSeatMappingRepository: Repository<showSeatMapping>,
    private readonly jwtService: JwtService,
  ) {}

  //공연 생성
  //공연 생성 시, 좌석정보, 회차정보, 매핑정보 함께 생성
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
        showId: newShow.showId,
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

    //좌석 매핑 정보 생성
    const showtimes = await this.showTimeInfoRepository.find({
      where : {showId: newShow.showId},
      select : ['showTimeId'],
    });

    const seats = await this.seatRepository.find({
      where: {hallId: existHall.hallId},
      select: ['seatId'],
    });

    for ( const time of showtimes) {
      for ( const seat of seats) {
        await this.showSeatMappingRepository.save({
          showId: newShow.showId,
          showTimeId: time.showTimeId,
          seatId: seat.seatId,
          isReserved: false,
        });
      }
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

    if(!findShow) {
      throw new NotFoundException(
        '해당하는 공연이 없습니다.'
      );
    }

    return findShow;
  }

  //공연명 검색
  async searchOne(searchShowDto: SearchShowDto) {

    const searchShow = await this.showRepository.query(
      `select show_name, hall_name, category, start_date , end_date ,runtime , content , seat_info , status
      from shows
      where show_name like '%${searchShowDto.showName}%';`
    );

    if(searchShow.length === 0) {
      throw new NotFoundException(
        '해당하는 공연이 없습니다.'
      );
    }

    return searchShow;
  }

  //공연 좌석 예매 현황 확인(예매 가능한 좌석보기)
  async findSeat(id: number, showtime: Date) {

    const time = await this.showTimeInfoRepository.findOne({
      where: {showTime: showtime},
    })

    const findShow = await this.showSeatMappingRepository.find({
      where: {showId: id, showTimeId: time.showTimeId},
      relations: ['show','seat'],
      select: {
        show: {
          showName: true,
        },
        seat: {
          seatGrade: true,
          seatFloor: true,
          seatRow: true,
          seatNumber: true,
        },
        isReserved : true,
      }
    });

    const resShow = findShow.map((item) => ({
      showName: item.show.showName,
      seat: item.seat.seatGrade 
            + ' ' + item.seat.seatFloor 
            + ' ' + item.seat.seatRow 
            + ' ' + item.seat.seatNumber,
      isReserved: item.isReserved ? '에매 불가능' : '예매 가능',
    }));

    return resShow;
  }
}

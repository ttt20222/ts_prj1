import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { User } from 'src/user/entities/user.entity';
import { Reserve } from './entities/reserve.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Show } from 'src/show/entities/show.entity';
import { showSeatMapping } from 'src/show/entities/showSeatMapping.entity';
import { Seat } from 'src/show/entities/seat.entity';
import { showTimeInfo } from 'src/show/entities/showTimeInfo.entity';
import { Point } from 'src/user/entities/point.entity';
import { PointLog } from 'src/user/entities/point_log.entity';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(Reserve)
    private reserveRepository: Repository<Reserve>,
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    @InjectRepository(showSeatMapping)
    private showSeatMappingRepository: Repository<showSeatMapping>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    @InjectRepository(showTimeInfo)
    private showTimeInfoRepository: Repository<showTimeInfo>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(PointLog)
    private pointLogRepository: Repository<PointLog>,
    private readonly jwtService: JwtService,
  ) {}

  //티켓번호 생성
  randomTicketNumber(): string {
    const prefix = 't';
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // 10자리 숫자
    return prefix + randomNumber;
  };

  //유니크 티켓번호 생성
  async getUniqueTicketNumber(): Promise<string> {
    let isUnique = false;
    let ticketNumber = '';

    while (!isUnique) {
      ticketNumber = this.randomTicketNumber();
      const existingTicket = await this.reserveRepository.findOne({
        where: { ticketNumber: ticketNumber },
      });

      if (!existingTicket) {
        isUnique = true;
      }
    }

    return ticketNumber;
  };

  //예매 생성
  async reserveShow(user: User, createReserveDto: CreateReserveDto) {

    const show = await this.showRepository.findOne({
      where: {showName: createReserveDto.showName},
    });

    const findSeatId = await this.seatRepository.findOne({
      where: {showId: show.showId}
    })

    const findShowTimeId = await this.showTimeInfoRepository.findOne({
      where: {showTime: createReserveDto.showTime}
    })

    //예매 가능 여부 확인
    const checkReserve = await this.showSeatMappingRepository.findOne({
      where: {
        showId: show.showId,
        showTimeId: findShowTimeId.showTimeId,
        seatId: findSeatId.seatId,
      },
    });
    if(checkReserve.isReserved === true){
      throw new BadRequestException(
        '이미 선택된 좌석입니다.'
      )
    };

    //예매 가능 포인트 확인
    const seatGrade = createReserveDto.seatInfo.split(' ')[0];

    const gradePrice = JSON.parse(JSON.stringify(show.seatInfo)).find((info:any) => info.grade === seatGrade.toLowerCase());

    const userInfo = await this.pointRepository.findOne({
      where: {userId: user.userId},
    });
    if(userInfo.point < gradePrice.price) {
      throw new BadRequestException(
        '잔여 포인트가 부족합니다.'
      )
    };

    //예매 정보 생성
    const ticketNumber = await this.getUniqueTicketNumber();
    const reserveShow = await this.reserveRepository.save({
      userId: user.userId,
      ticketNumber: ticketNumber,
      showId: show.showId,
      showTime: createReserveDto.showTime,
      seatInfo: createReserveDto.seatInfo,
      price: gradePrice.price,
    })

    //좌석 예매로 변경
    await this.showSeatMappingRepository.update(
      {
        showId: show.showId,
        showTimeId: findShowTimeId.showTimeId,
        seatId: findSeatId.seatId,
      },
      {
        isReserved: true,
      }
    );

    //포인트 차감
    await this.pointLogRepository.create(
      {
        userId: user.userId,
        point: -reserveShow.price,
      }
    );

    await this.pointRepository.update(
      {userId: user.userId},
      {point: userInfo.point - reserveShow.price}
    );

    return reserveShow;
  }

  // findAll() {
  //   return `This action returns all reserve`;
  // }

  // update(id: number, updateReserveDto: UpdateReserveDto) {
  //   return `This action updates a #${id} reserve`;
  // }
}

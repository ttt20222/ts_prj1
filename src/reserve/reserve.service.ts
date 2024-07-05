import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';

import { CreateReserveDto } from './dto/create-reserve.dto';
import { User } from 'src/user/entities/user.entity';
import { Reserve } from './entities/reserve.entity'
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Show } from 'src/show/entities/show.entity';
import { showSeatMapping } from 'src/show/entities/showSeatMapping.entity';
import { Seat } from 'src/show/entities/seat.entity';
import { showTimeInfo } from 'src/show/entities/showTimeInfo.entity';
import { Point } from 'src/user/entities/point.entity';
import { PointLog } from 'src/user/entities/point_log.entity';
import { Status } from './types/reserve.type';
import moment from 'moment';

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
    private entityManager: EntityManager,
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

    const seatGrade = createReserveDto.seatInfo.split(' ')[0];
    const seatFloor = createReserveDto.seatInfo.split(' ')[1];
    const seatRow = createReserveDto.seatInfo.split(' ')[2];
    const seatNumber = createReserveDto.seatInfo.split(' ')[3];

    const findSeatId = await this.seatRepository.findOne({
      where: {showId: show.showId,
              seatGrade: seatGrade,
              seatFloor: seatFloor,
              seatRow: seatRow,
              seatNumber: +seatNumber,
      },
    });

    const findShowTimeId = await this.showTimeInfoRepository.findOne({
      where: {showTime: createReserveDto.showTime,
              showId: show.showId,
      }
    })

    //예매 가능 포인트 확인
    const gradePrice = JSON.parse(JSON.stringify(show.seatInfo)).find((info:any) => info.grade === seatGrade.toLowerCase());

    const userInfo = await this.pointRepository.findOne({
      where: {userId: user.userId},
    });
    if(userInfo.point < gradePrice.price) {
      throw new BadRequestException(
        '잔여 포인트가 부족합니다.'
      )
    };

    //예매 정보 생성 트랜잭션
    return await this.entityManager.transaction(async (manager) => {
      try{
        //좌석 선택하고 잠금설정
        const seatMapping = await manager.findOne(showSeatMapping, {
          where: {
            showId: show.showId,
            showTimeId: findShowTimeId.showTimeId,
            seatId: findSeatId.seatId,
          },
          lock: { mode: 'pessimistic_write'},
        });

        // 좌석 예매 가능여부 확인
        if (seatMapping.isReserved === true) {
          throw new BadRequestException('예매 불가능 좌석입니다.');
        }

        //좌석 예매로 변경
        await manager.update(showSeatMapping,
          {
            showId: show.showId,
            showTimeId: findShowTimeId.showTimeId,
            seatId: findSeatId.seatId,
          },
          {
            isReserved: true,
          }
        );

        const ticketNumber = await this.getUniqueTicketNumber();
        const reserveShow = await manager.save(Reserve, {
          userId: user.userId,
          ticketNumber: ticketNumber,
          showId: show.showId,
          showTime: createReserveDto.showTime,
          seatInfo: createReserveDto.seatInfo,
          price: gradePrice.price,
        });

        //포인트 차감
        await manager.save(PointLog, 
          {
            userId: user.userId,
            point: -reserveShow.price,
          }
        );

        await manager.update(Point, 
          {userId: user.userId},
          {point: userInfo.point - reserveShow.price}
        );

        return reserveShow;

      } catch(error) {
        if (error instanceof QueryFailedError) {
          throw new ConflictException('이미 선택된 좌석입니다.');
        }
      }
   });
  }

  //예매 목록 확인
  async findReserve(user: User) {
    
    const userReserve = await this.reserveRepository.find({
      relations: ['show'],
      where: {userId: user.userId},
      select: {
        reserveId: true,
        ticketNumber: true,
        show: {
          showName : true,
        },
        showTime: true,
        seatInfo: true,
        price: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {createdAt: 'DESC'}
    });

    if(!userReserve || userReserve.length === 0) {
      throw new BadRequestException(
        '예매 내역이 없습니다.'
      );
    };

    userReserve.forEach((show: any) => {
      show.showTime =  moment(show.showTime).format('YYYY-MM-DD HH:mm');
    })

    return userReserve;
  }

  //예매 취소
  async reserveDelete(user: User, id: number) {
    
    const reserve = await this.reserveRepository.findOne({
      where: {reserveId: id},
    });

    if(!reserve) {
      throw new BadRequestException(
        '예매 내역이 없습니다.'
      );
    };

    //공연시작 3시간 전까지만 취소 가능
    const now = new Date();
    const timeCal = (reserve.showTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if( timeCal < 3) {
      throw new BadRequestException(
        '공연 시작 3시간 전까지만 취소 가능합니다.'
      )
    };

    return await this.entityManager.transaction("SERIALIZABLE", async (manager) => {
    //좌석 예매불가능 -> 가능으로 변경
    const seatGrade = reserve.seatInfo.split(' ')[0];
    const seatFloor = reserve.seatInfo.split(' ')[1];
    const seatRow = reserve.seatInfo.split(' ')[2];
    const seatNumber = reserve.seatInfo.split(' ')[3];

    const findSeatId = await manager.findOne(Seat, {
      where: {showId: reserve.showId,
              seatGrade: seatGrade,
              seatFloor: seatFloor,
              seatRow: seatRow,
              seatNumber: +seatNumber,
      },
    });

    const findShowTimeId = await manager.findOne(showTimeInfo, {
      where: {showTime: reserve.showTime,
              showId: reserve.showId,
      }
    })

    await manager.update(showSeatMapping, 
      {showId: reserve.showId,
       showTimeId: findShowTimeId.showTimeId,
       seatId: findSeatId.seatId,
      },
      {isReserved: false},
    );

    //예매내역 예매완료 -> 예매취소 변경
    const reserveCancle = await manager.update(Reserve, 
      {reserveId: id},
      {status: Status.예매취소}
    )

    //포인트 환불
    await manager.save({PointLog, 
      userId: user.userId,
      point: reserve.price,
    });

    const userInfo = await manager.findOne(Point, {
      where: {userId: user.userId},
    });

    await manager.update(Point,
      {userId: user.userId},
      {point: userInfo.point + reserve.price},
    );

    return reserveCancle;
    });
  }
}

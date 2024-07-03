import { Injectable } from '@nestjs/common';
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

    const seatGrade = createReserveDto.seatInfo.split('')[0];

    const findSeatId = await this.seatRepository.findOne({
      where: {showId: show.showId}
    })

    const findShowTimeId = await this.showTimeInfoRepository.findOne({
      where: {showTime: createReserveDto.showTime}
    })

    const ticketNumber = await this.getUniqueTicketNumber();

    const gradePrice = JSON.parse(show.seatInfo).find((info:any) => info.grade === seatGrade);

    //예매 정보 생성
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

    return reserveShow;
  }

  // findAll() {
  //   return `This action returns all reserve`;
  // }

  // update(id: number, updateReserveDto: UpdateReserveDto) {
  //   return `This action updates a #${id} reserve`;
  // }
}

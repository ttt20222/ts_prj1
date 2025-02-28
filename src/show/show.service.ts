import { ForbiddenException, Injectable } from '@nestjs/common';
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
import { showSeatMapping } from './entities/showSeatMapping.entity';
import moment from 'moment';
import { FindShowDto } from './dto/find-show.dto';
import { AwsService } from 'src/aws/aws.service';
import { v4 as uuidv4 } from 'uuid';

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
    private readonly awsService: AwsService,
  ) {}

  //공연 생성
  //공연 생성 시, 좌석정보, 회차정보, 매핑정보 함께 생성
  async createShow(user: User, createShowDto: CreateShowDto) {

    if(user.isAdmin !== true){
      throw new ForbiddenException(
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

  //공연이미지 등록
  async createShowImage(user: User, id: number, file: Express.Multer.File) {

    if(user.isAdmin !== true){
      throw new ForbiddenException(
        '공연 등록 권한이 없습니다.'
      );
    }

    const existShow = await this.showRepository.findOne({
      where: {showId: id},
    });

    if(!existShow) {
      throw new BadRequestException(
        '공연이 존재하지 않습니다. 공연 먼저 등록해주세요.'
      )
    };

    //이미지 s3업로드
    const imageName = uuidv4();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    //이미지 생성
    await this.imageRepository.save({
      showId: id,
      imageUrl : imageUrl,
    })

    return {message: `${existShow.showName} 이미지 등록 성공`}
  };

//공연 상세조회
  async findOne(id: number) {

    const findShow = await this.showRepository.find({
      relations: ['showtimeinfo', 'image'],
      where: {showId: id},
      select: {
        showtimeinfo: {
          showTime: true
        },
        image: {
          imageUrl: true
        },
        showId: true,
        showName: true,
        hallName: true,
        category: true,
        startDate: true,
        endDate: true,
        runtime: true,
        content: true,
        seatInfo: true,
        status: true,
      },
    });

    if(!findShow) {
      throw new NotFoundException(
        '해당하는 공연이 없습니다.'
      );
    }

    findShow[0].showtimeinfo.forEach((time: any) => {
      time.showTime = moment(time.showTime).format('YYYY-MM-DD HH:mm');
    });

    return findShow;
  }

  //공연명 검색
  async searchOne(searchShowDto: SearchShowDto) {

    const searchShow = await this.showRepository.query(
      `select a.show_name, a.hall_name, a.category, b.image_url, a.start_date , a.end_date , a.runtime , a.content , a.seat_info , a.status
      from shows a join images b
      on a.show_id = b.show_id
      where a.show_name like '%${searchShowDto.showName}%';`
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

  //공연검색 (전체, 카테고리별)
  async findAll(findShowDto: FindShowDto) {
    if(findShowDto) {
      const shows = await this.showRepository.find({
        relations: ['image'],
        where: {category: findShowDto.category},
      });

      return shows;

    }else{
      const allShows = await this.showRepository.find({
        relations: ['image'],
        order: {createdAt: 'DESC'}
      });

      return allShows;
    }
  }
}

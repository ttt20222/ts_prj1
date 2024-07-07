import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../types/showCategory.type';
import { Status } from '../types/showStatus.type';

export interface SeatDetail {
  seatGrade: string;
  seatFloor: string;
  seatRow: string;
  seatNumber: number;
}

export class CreateShowDto {

  @IsString()
  @IsNotEmpty({ message: '공연명을 입력해주세요.' })
  showName: string;

  @IsString()
  @IsNotEmpty({ message: '공연장소를 입력해주세요.' })
  hallName: string;

  @IsEnum(Category, {message: 'Valid options: 뮤지컬 / 콘서트 / 연극'})
  @IsNotEmpty({ message: '공연 카테고리를 입력해주세요.' })
  category: Category;

  @IsString()
  @IsDateString()
  @IsNotEmpty({ message: '공연 시작일을 입력해주세요.' })
  startDate: Date;

  @IsString()
  @IsDateString()
  @IsNotEmpty({ message: '공연 마지막일을 입력해주세요.' })
  endDate: Date;

  @IsString()
  @IsNotEmpty({ message: '공연 시간을 입력해주세요.' })
  runtime: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명을 입력해주세요.' })
  content: string;

  @IsArray()
  @IsNotEmpty({ message: '공연 회차들을 입력해주세요.' })
  showTime: string[];

  @IsArray()
  @IsNotEmpty({ message: '좌석 정보를 입력해주세요. ex) [{seatGrade: vip, price: 50000}, {seatGrade: r, price: 40000}]' })
  seatInfo: string[];

  @IsArray()
  @IsNotEmpty({ message: '좌석 개별 정보를 입력해주세요. ex) [{seatGrade: vip, seatFloor: 1층, seatRow: 1열, seatNumber: 1}, {seatGrade: vip, seatFloor: 1층, seatRow: 1열, seatNumber: 2}]' })
  seatDetailInfo: SeatDetail[];

  @IsEnum(Status, {message: 'Valid options: 공연시작전 / 공연중 / 공연종료'})
  @IsNotEmpty({ message: '공연 상태를 입력해주세요.' })
  status: Status;
}
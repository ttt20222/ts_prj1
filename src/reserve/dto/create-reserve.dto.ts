import { IsNotEmpty, IsString } from "class-validator";

export class CreateReserveDto {

  @IsString()
  @IsNotEmpty({ message: '예매 공연명을 입력해주세요.' })
  showName: string;

  @IsNotEmpty({ message: '예매 회차를 입력해주세요.' })
  showTime: Date;

  @IsNotEmpty({ message: '예매 좌석을 입력해주세요.'})
  seatInfo: string;
}

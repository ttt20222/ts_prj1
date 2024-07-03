import { IsDate, IsNotEmpty } from 'class-validator';

export class FindSeatDto {

  @IsDate()
  @IsNotEmpty({ message: '회차를 입력해주세요.' })
  showTime: string;
}
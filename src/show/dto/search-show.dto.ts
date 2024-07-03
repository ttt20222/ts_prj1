import { IsNotEmpty, IsString } from 'class-validator';

export class SearchShowDto {

  @IsString()
  @IsNotEmpty({ message: '공연명을 입력해주세요.' })
  showName: string;
}
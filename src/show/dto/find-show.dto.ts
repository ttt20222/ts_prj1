import { IsEnum, IsOptional } from 'class-validator';
import { Category } from '../types/showCategory.type';

export class FindShowDto {

  @IsOptional()
  @IsEnum(Category, {message: 'Valid options: 뮤지컬 / 콘서트 / 연극'})
  category: Category;
}
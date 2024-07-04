import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async reserveShow(@UserInfo() user: User, @Body() createReserveDto: CreateReserveDto) {
    return this.reserveService.reserveShow(user, createReserveDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findReserve(@UserInfo() user: User) {
    return this.reserveService.findReserve(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async reserveDelete(@UserInfo() user: User, @Param('id') id: string) {
    return this.reserveService.reserveDelete(user, +id);
  }
}

import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  reserveShow(@UserInfo() user: User, @Body() createReserveDto: CreateReserveDto) {
    return this.reserveService.reserveShow(user, createReserveDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findReserve(@UserInfo() user: User) {
    return this.reserveService.findReserve(user);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reserveService.remove(+id);
  // }
}

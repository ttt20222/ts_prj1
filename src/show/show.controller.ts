import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { UserInfo } from 'src/utils/userInfo.decorator';

import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { SearchShowDto } from './dto/search-show.dto';

@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createShow(@UserInfo() user: User, @Body() createShowDto: CreateShowDto){
    return await this.showService.createShow(user, createShowDto);
  }

  @Get('search')
  async searchOne(@Body() searchShowDto: SearchShowDto) {
    return await this.showService.searchOne(searchShowDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.showService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/time')
  async findSeat(@Param('id') id: string, @Query('showtime') showtime: Date) {
    return await this.showService.findSeat(+id, showtime);
  }

  // @Get()
  // findAll() {
  //   return this.showService.findAll();
  // }
}

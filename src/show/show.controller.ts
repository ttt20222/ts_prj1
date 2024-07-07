import { Controller, Get, Post, Body, Param, UseGuards, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserInfo } from 'src/utils/userInfo.decorator';

import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { SearchShowDto } from './dto/search-show.dto';
import { FindShowDto } from './dto/find-show.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createShow(@UserInfo() user: User, @Body() createShowDto: CreateShowDto){
    return await this.showService.createShow(user, createShowDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  async createShowImage(@UserInfo() user: User, @Param('id') id: string, @UploadedFile() file: Express.Multer.File){
    return await this.showService.createShowImage(user, +id, file);
  }

  @Get()
  async findAll(@Query('category') findShowDto: FindShowDto) {
    return this.showService.findAll(findShowDto);
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
}

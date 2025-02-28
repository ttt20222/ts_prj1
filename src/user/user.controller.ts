import { UserInfo } from 'src/utils/userInfo.decorator';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.register(
      createUserDto.email, createUserDto.password, createUserDto.passwordConfirm, createUserDto.name, createUserDto.nickname);
  }

  @Post('sign-in')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/users')
  async getUser(@UserInfo() user: User){
    return await this.userService.getUser(user);
  }
}
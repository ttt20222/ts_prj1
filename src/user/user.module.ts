import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Point } from './entities/point.entity';
import { PointLog } from './entities/point_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Point, PointLog])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

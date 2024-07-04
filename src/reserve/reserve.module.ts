import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Show } from 'src/show/entities/show.entity';
import { UserModule } from 'src/user/user.module';
import { ReserveController } from './reserve.controller';
import { ReserveService } from './reserve.service';
import { Reserve } from './entities/reserve.entity';
import { User } from 'src/user/entities/user.entity';
import { ShowModule } from 'src/show/show.module';
import { showSeatMapping } from 'src/show/entities/showSeatMapping.entity';
import { Seat } from 'src/show/entities/seat.entity';
import { showTimeInfo } from 'src/show/entities/showTimeInfo.entity';
import { Point } from 'src/user/entities/point.entity';
import { PointLog } from 'src/user/entities/point_log.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Reserve, User, Show, showSeatMapping, Seat, showTimeInfo, Point, PointLog]),
    UserModule,
    ShowModule,
  ],
  controllers: [ReserveController],
  providers: [ReserveService]
})
export class ReserveModule {}

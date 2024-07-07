import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Show } from './entities/show.entity';
import { Hall } from './entities/hall.entity';
import { Seat } from './entities/seat.entity';
import { Image } from './entities/image.entity';
import { showTimeInfo } from './entities/showTimeInfo.entity';
import { showSeatMapping } from './entities/showSeatMapping.entity';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { UserModule } from 'src/user/user.module';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Show, Image, Hall, Seat, showTimeInfo, showSeatMapping]),
    UserModule,
    AwsModule,
  ],
  providers: [ShowService],
  controllers: [ShowController],
  exports: [ShowService],
})
export class ShowModule {}

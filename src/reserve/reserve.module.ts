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

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Reserve, User, Show]),
    UserModule,
    ShowModule,
  ],
  controllers: [ReserveController],
  providers: [ReserveService]
})
export class ReserveModule {}

import { Module } from '@nestjs/common';
import Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Point } from './user/entities/point.entity';
import { PointLog } from './user/entities/point_log.entity';
import { AuthModule } from './auth/auth.module';
import { ShowModule } from './show/show.module';
import { Show } from './show/entities/show.entity';
import { Hall } from './show/entities/hall.entity';
import { Seat } from './show/entities/seat.entity';
import { Image } from './show/entities/image.entity';
import { showTimeInfo } from './show/entities/showTimeInfo.entity';
import { showSeatMapping } from './show/entities/showSeatMapping.entity';
import { ReserveModule } from './reserve/reserve.module';
import { Reserve } from './reserve/entities/reserve.entity';
import { AwsModule } from './aws/aws.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User, Point, PointLog, Show, Image, Hall, Seat, showTimeInfo, showSeatMapping, Reserve],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UserModule,
    AuthModule,
    ShowModule,
    ReserveModule,
    AwsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

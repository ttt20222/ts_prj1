import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Point } from './entities/point.entity';
import { PointLog } from './entities/point_log.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(PointLog)
    private pointLogRepository: Repository<PointLog>,
    private readonly jwtService: JwtService,
  ) {}

  //회원가입
  async register(email: string, password: string, passwordConfirm: string, name: string, nickname: string) {

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    if(password !== passwordConfirm){
      throw new BadRequestException(
        '비밀번호가 일치하지 않습니다.'
      );
    }

    const hashedPassword = await hash(password, 10);
    const initialPoint = 1000000;

    //유저 생성
    const newUser = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      nickname
    });
    
    //포인트테이블 생성
    await this.pointRepository.save({
      userId: newUser.userId,
      point: initialPoint,
    });

    //포인트로그테이블 생성
    await this.pointLogRepository.save({
      userId: newUser.userId,
      point: initialPoint,
    });

    return newUser;
  }
  

  //로그인
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['email', 'password'],
      where: { email },
    });

    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  //이메일로 찾기
  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  //내 정보 조회하기
  async getUser(user: User){
    const getUser = await this.userRepository.query(
      `select a.email as email, a.name as name, a.nickname as nickname, b.point as point
      from users a join points b
      on a.user_id = b.user_id
      where a.user_id = ${user.userId};`
    );

    return getUser;
  }
}
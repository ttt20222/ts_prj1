# 온라인 공연 예매 사이트

## 프로젝트 소개

`TypeScript`와 `Nest.js`, `TypeORM`을 사용하여, 온라인 공연 예매 서비스를 만들어봅니다.

## API

[API명세서 링크](https://admitted-dream-193.notion.site/07a3d6b3ea80448186f7979a100e856b?pvs=44)

## ERD

[ERD 링크](https://drawsql.app/teams/les-team-1/diagrams/ts-prj1)

## 주요 기능 및 설명

### 1. 회원가입 API

<img width="1274" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/137a6569-cd9f-43d9-83fc-37b669fb4234">

<br>

### 2. 로그인 API

<img width="1278" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/9afef0a8-4036-4aae-bfc3-9726879b2cd8">

<br>

### 3. 내 정보 조회 API

<img width="1281" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/f8d5aab5-7f96-4888-ac22-06d8879d7661">

<br>

### 4. 공연 등록 API (관리자)

<img width="1275" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/0b2c0a81-ee7a-41e1-8ebc-25fab732cb48">

<br>

### 5. 공연 이미지 등록 API (관리자)

<img width="1275" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/49698f5b-82bc-413a-994e-d7b363b0b225">

<br>

### 6. 공연 상세조회 API

<img width="1459" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/54ddf0e0-fe49-4252-b392-670dc31f000c">


<br>

### 7. 공연명 검색 API

<img width="1275" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/b028ae82-8467-4c8f-9997-174f709abdc9">


<br>

### 8. 공연 전체/카테고리 검색 API

<img width="1276" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/52efdeea-5ddb-479c-95cc-6fe48775d8c1">


<br>

### 9. 예매 가능 좌석 확인 API

<img width="1279" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/eaff10b7-c68d-43e9-a87c-90a30c95e58f">


<br>

### 10. 예매하기 API

<img width="1287" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/d37016d0-3603-40f9-bfdd-df5b4f5a9e41">


<br>

### 11. 예매목록확인 API

<img width="1285" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/46b50a22-bc74-4131-a8a0-b0d674a54823">


<br>

### 12. 예매 취소 API

<img width="1271" alt="image" src="https://github.com/ttt20222/ts_prj1/assets/132965634/a7018e7c-1b3d-4198-8667-ac8e123d73af">



## commit 규칙

| 작업 타입   | 작업내용                       |
| ----------- | ------------------------------ |
| update	| 새로운 기능 추가
| add	|없던 파일 생성, 초기 세팅
| fix	|코드 수정
| bugfix	|버그 수정
| docs	|문서 수정
| style	|코드 스타일 변경
| design	|사용자 UI 디자인 변경 (CSS 등)
|test	|테스트 코드, 리팩토링 테스트 코드 추가
|refactor	|코드 리팩토링
|rename	|파일 혹은 폴더명을 수정만 한 경우
|remove	|폴더/ 파일 이동
|del	|기능/파일을 삭제


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

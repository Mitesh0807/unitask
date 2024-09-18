import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtStrategy } from 'src/auth/strategies/access.strategy';
import { RtStrategy } from 'src/auth/strategies/refresh.strategy';
import { User } from 'src/comman/entity/user.entity';
import { JwtStrategy } from 'src/comman/strategy/jwt.strategy';
import { LocalStategy } from 'src/comman/strategy/local.strategy';
import { RefreshJwtStrategy } from 'src/comman/strategy/refresh-jwt.strategy';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    HttpModule,
  ],
  providers: [
    UsersService,
    AtStrategy,
    RtStrategy,
    ConfigService,
    JwtStrategy,
    LocalStategy,
    RefreshJwtStrategy,
  ],

  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtStrategy } from 'src/auth/strategies/access.strategy';
import { RtStrategy } from 'src/auth/strategies/refresh.strategy';
import { User } from 'src/comman/entity/user.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  providers: [UsersService, AtStrategy, RtStrategy, ConfigService],
  controllers: [UsersController],
})
export class UsersModule {}

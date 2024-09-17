import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Tokens } from 'src/auth/types/tokens.type';
import { GetCurrentUser } from 'src/comman/decorators/get-current-user.decorator';
import { GetCurrentUserId } from 'src/comman/decorators/get-current-user-id.decorator';
import { Public } from 'src/comman/decorators/public.decorator';
import { CreateUserDto } from 'src/comman/dto/create-user.dto';
import { RtGuard } from 'src/comman/guards/refresh.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.userService.signupLocal(dto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.userService.signinLocal(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.userService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.userService.refreshTokens(userId, refreshToken);
  }
}

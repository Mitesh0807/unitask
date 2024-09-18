import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Tokens } from 'src/auth/types/tokens.type';
import { GetCurrentUserId } from 'src/comman/decorators/get-current-user-id.decorator';
import { Public } from 'src/comman/decorators/public.decorator';
import { CreateUserDto } from 'src/comman/dto/create-user.dto';
import { JwtAuthGuard } from 'src/comman/guards/jwt-auth.guard';
import { RtGuard } from 'src/comman/guards/refresh.guard';

import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private userService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const tokens = await this.userService.signupLocal(dto);
    this.setTokenCookies(res, tokens);
    return tokens;
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const tokens = await this.userService.signinLocal(dto);
    this.setTokenCookies(res, tokens);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const userId = req.cookies['userId'];
    const result = await this.userService.logout(userId);
    this.clearTokenCookies(res);
    return result;
  }

  @Get('me')
  async getProfile(@GetCurrentUserId() userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.getUserProfile(userId);
  }

  @Public()
  @Get('/random-joke')
  async getRandomJoke() {
    const response = await firstValueFrom(
      this.httpService.get('https://api.chucknorris.io/jokes/random'),
    );
    return response.data;
  }
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const refreshToken =
      req.get('authorization')?.split(' ')[1] ||
      req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }
    try {
      const tokens = await this.userService.refreshTokens(userId, refreshToken);
      this.setTokenCookies(res, tokens);
      return tokens;
    } catch (error) {
      this.clearTokenCookies(res);
      throw error;
    }
  }

  private setTokenCookies(res: Response, tokens: Tokens): void {
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  private clearTokenCookies(res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}

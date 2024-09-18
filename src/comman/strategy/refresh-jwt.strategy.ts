import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

export interface TokenPayload {
  userId: string;
}

export interface RefreshTokenPayload extends TokenPayload {
  refreshToken: string;
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly usersSerivce: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.cookies;
          const refreshToken = cookies.refresh_token;
          if (!refreshToken) {
            throw new UnauthorizedException(
              'No refresh token in cookies please redirect to login',
            );
          }
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('RT_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: RefreshTokenPayload) {
    const user = await this.usersSerivce.getUserProfile(payload.userId);
    if (!user) {
      throw new UnauthorizedException('No user found');
    }
    //TODO:need to fix
    // const {  } = user;
    // if (!refreshToken) {
    //   throw new UnauthorizedException('No refresh token found');
    // }
    // if (refreshToken !== request.cookies.refreshToken) {
    //   throw new UnauthorizedException('Invalid refresh token');
    // }
    return user;
  }
}

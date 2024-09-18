import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const accessToken = request.cookies['access_token'] || ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          return accessToken;
        },
      ]),
      secretOrKey: configService.get<string>('AT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.getUserProfile(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}

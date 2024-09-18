import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../types/jwtPayload.type';
import { JwtPayloadWithRt } from '../types/jwtPayloadWithRt.type';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const authHeader = request.get('authorization');
          if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
            return authHeader.split(' ')[1];
          }
          return request?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: config.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken =
      req.get('authorization')?.split(' ')[1] ||
      req.cookies?.refresh_token;

    if (!refreshToken) throw new ForbiddenException('Refresh token not found');

    return {
      ...payload,
      refreshToken,
    };
  }
}
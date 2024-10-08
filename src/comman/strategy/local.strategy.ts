import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.usersService.verifyUser(email, password);
      return user;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}

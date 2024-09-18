import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';
import { Tokens } from 'src/auth/types/tokens.type';
import { CreateUserDto } from 'src/comman/dto/create-user.dto';
import { IsNull, Not, Repository } from 'typeorm';

import { User } from '../comman/entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signupLocal(dto: CreateUserDto): Promise<Tokens> {
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.userRepository.save({
        email: dto.email,
        password: hash,
      });

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      if (error.code === '23505') {
        throw new ForbiddenException('Credentials incorrect');
      }
      throw error;
    }
  }
  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new UnprocessableEntityException('Invalid credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException('Invalid credentials');
    }
    delete user.password;
    delete user.refreshToken;
    return user;
  }

  async logout(userId: string): Promise<boolean> {
    await this.userRepository.update(
      { id: userId, refreshTokenHash: Not(IsNull()) },
      { refreshTokenHash: null },
    );
    return true;
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException(
        'Access Denied: User not found or no refresh token',
      );
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);
    await this.userRepository.update(userId, { refreshTokenHash: hash });
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}

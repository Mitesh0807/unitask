import { IsEmail, IsString, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @MinLength(8)
  password: string;

  @Column({ nullable: true })
  @IsString()
  refreshTokenHash?: string;

  @Column({ nullable: true })
  @IsString()
  refreshToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt?: Date;
}

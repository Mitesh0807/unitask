import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { User } from '../comman/entity/user.entity';

dotenv.config();

export class ConfigService {
  constructor(private env: { [key: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value as string;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.getValue('DB_URL'),
      entities: [User],
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsTableName: 'migration',
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
/*
 *this method is used for connectiong local instance or docker container with supplied envs */
// public getTypeOrmConfig(): TypeOrmModuleOptions {
//   return {
//     type: 'postgres',
//     host: this.getValue('DB_HOST'),
//     port: parseInt(this.getValue('DB_PORT')),
//     username: this.getValue('DB_USERNAME'),
//     password: this.getValue('DB_PASSWORD'),
//     database: this.getValue('DB_NAME'),
//     entities: [User],
//     migrations: ['dist/migrations/*{.ts,.js}'],
//     migrationsTableName: 'migration',
//     ssl: this.isProduction(),
//     autoLoadEntities: true,
//     synchronize: true,
//   };
// }

const configService = new ConfigService(process.env).ensureValues([
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'AT_SECRET',
  'RT_SECRET',
  'DB_URL',
]);

export { configService };

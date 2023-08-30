import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { REDIS_CLIENT, REDIS_TTL } from './constants';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,
  ) {}

  async onModuleInit() {
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.disconnect();
  }

  async set(key: string, value: string) {
    try {
      return await this.redisClient.setEx(key, REDIS_TTL, value);
    } catch (error) {
      console.log(error);
    }
  }

  async get(key: string) {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      console.log(error);
    }
  }

  async del(key: string) {
    try {
      const [userPattern, _] = key.split(':');
      let cursor = 0;
      const scanResult = await this.redisClient.scan(cursor, {
        MATCH: userPattern + '*',
      });

      for (key of scanResult.keys) {
        cursor = scanResult.cursor;
        await this.redisClient.del(key);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

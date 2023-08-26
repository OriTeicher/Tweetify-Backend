import { Logger, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { REDIS_CLIENT } from './constants';
import { retryStrategy } from './redis-retry.strategy';
import { CacheInterceptor } from './cache.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [ConfigModule],
  providers: [
    CacheInterceptor,
    CacheService,
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        Logger.log('[!] Initializing redis...');
        return createClient({
          socket: {
            reconnectStrategy: retryStrategy,
          },
          url: configService.get<string>('REDIS_URL'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}

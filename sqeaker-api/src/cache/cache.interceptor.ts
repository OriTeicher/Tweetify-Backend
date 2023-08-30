import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap, of } from 'rxjs';
import { CacheService } from './cache.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Reflector } from '@nestjs/core';
import { CacheType } from './cache.enum';
import { CACHE_TYPE_KEY } from './cache.decorator';
import { Response, Request } from 'express';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly shouldCacheMap: Record<CacheType, () => boolean> = {
    [CacheType.SHOULD_CACHE]: () => true,
    [CacheType.SHOULD_NOT_CACHE]: () => false,
  };

  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    if (!(await this.shouldCache(context))) {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest<Request>();
    const { originalUrl, method } = request;
    const user = request['user'] as UserEntity;
    const cacheKey = `${user.id}:${originalUrl}`;

    response.setHeader('Content-Type', 'application/json');

    if (method === 'DELETE') {
      this.cacheService.del(cacheKey);
      return next.handle();
    }

    if (method === 'GET') {
      const cachedData = await this.cacheService.get(cacheKey);
      if (cachedData) return of(JSON.parse(cachedData));
    }

    return next.handle().pipe(
      tap(async (data) => {
        // TODO: Improve cache invalidation later...
        await this.cacheService.del(cacheKey);
        await this.cacheService.set(cacheKey, JSON.stringify(data));
        return data;
      }),
    );
  }

  private async shouldCache(context: ExecutionContext): Promise<boolean> {
    const cacheTypes = this.reflector.getAllAndOverride<CacheType[]>(
      CACHE_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [CacheType.SHOULD_CACHE];
    const handlers = cacheTypes.map((type) => this.shouldCacheMap[type]);

    for (const instance of handlers) {
      const shouldCache = await Promise.resolve(instance());
      if (!shouldCache) return false;
    }
    return true;
  }
}

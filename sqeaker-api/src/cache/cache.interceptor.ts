import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap, of } from 'rxjs';
import { CacheService } from './cache.service';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { originalUrl } = request;

    const user = request['user'] as UserEntity;
    const cacheKey = `${user.id}:${originalUrl}`;

    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return of(JSON.parse(cachedData));

    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheService.set(cacheKey, JSON.stringify(data));
      }),
    );
  }
}

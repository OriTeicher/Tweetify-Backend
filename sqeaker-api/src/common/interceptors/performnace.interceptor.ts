import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    console.time('performance');
    return next.handle().pipe(tap(() => console.timeEnd('performance')));
  }
}

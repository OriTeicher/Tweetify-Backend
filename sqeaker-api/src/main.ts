import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GLOBAL_PREFIX } from './common/constants';
import { PerformanceInterceptor } from './common/interceptors/performnace.interceptor';
import { SerializeInterceptor } from './common/serialize/serialize.interceptor';
import { UserEntity } from './users/entities/user.entity';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(
    new PerformanceInterceptor(),
    new SerializeInterceptor(UserEntity),
  );
  app.enableCors();

  app.setGlobalPrefix(GLOBAL_PREFIX);
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();

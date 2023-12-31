import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GLOBAL_PREFIX } from './common/constants';
import { PerformanceInterceptor } from './common/interceptors/performnace.interceptor';
import { SerializeInterceptor } from './common/serialize/serialize.interceptor';
import { UserEntity } from './users/entities/user.entity';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import tracer from './telemetry/tracer';

async function bootstrap() {
  await tracer.start();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(compression({ encodings: ['gzip', 'deflate'] }));
  app.use(cookieParser());
  app.enableShutdownHooks();
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipNullProperties: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(
    new PerformanceInterceptor(),
    new SerializeInterceptor(UserEntity),
  );

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();

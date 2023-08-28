import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CommentsModule } from './comments/comments.module';
import { IamModule } from './iam/iam.module';
import * as Joi from 'joi';
import { SearchModule } from './search/search.module';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      validationSchema: Joi.object({
        FIREBASE_API_KEY: Joi.string().required(),
        FIREBASE_AUTH_DOMAIN: Joi.string().required(),
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_STORAGE_BUCKET: Joi.string().required(),
        FIREBASE_MESSAGING_SENDER_ID: Joi.string().required(),
        FIREBASE_APP_ID: Joi.string().required(),
        FIREBASE_MEASURMENT_ID: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_TOKEN_AUDIENCE: Joi.string().required(),
        JWT_TOKEN_ISSUER: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
        JWT_REFRESH_JWT_TTL: Joi.number().required(),
        ES_API_KEY: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
        CORS_ORIGIN: Joi.string().required(),
        PORT: Joi.number().optional().default(3000),
      }),
    }),
    SearchModule,
    LoggerModule,
    UsersModule,
    PostsModule,
    DatabaseModule,
    CommentsModule,
    IamModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

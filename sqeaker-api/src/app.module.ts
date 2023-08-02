import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CommentsModule } from './comments/comments.module';
import * as Joi from 'joi';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SearchModule } from './search/search.module';

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
        PORT: Joi.number().optional().default(3000),
      }),
    }),
    UsersModule,
    PostsModule,
    DatabaseModule,
    CommentsModule,
    EventEmitterModule.forRoot(),
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

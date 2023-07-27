import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        AUTH_DOMAIN: Joi.string().required(),
        PROJECT_ID: Joi.string().required(),
        STORAGE_BUCKET: Joi.string().required(),
        MESSAGING_SENDER_ID: Joi.string().required(),
        APP_ID: Joi.string().required(),
        MEASUREMENT_ID: Joi.string().required(),
        PORT: Joi.number().optional().default(3000),
      }),
    }),
    UsersModule,
    PostsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

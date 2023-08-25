import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { SearchModule } from 'src/search/search.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DatabaseModule, SearchModule, CacheModule],
  exports: [UsersService],
})
export class UsersModule {}

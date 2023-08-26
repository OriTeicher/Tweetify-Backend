import { Logger, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import SearchServiceBase from './services/search-base.service';
import SearchUserService from './services/search-user.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        Logger.log('[!] Initializing Elasticsearch...');
        return {
          maxRetries: 10,
          node: configService.get('ELASTICSEARCH_NODE'),
          auth: {
            username: configService.get('ELASTICSEARCH_USERNAME'),
            password: configService.get('ELASTICSEARCH_PASSWORD'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SearchServiceBase, SearchUserService],
  exports: [ElasticsearchModule, SearchUserService],
})
export class SearchModule {}

import { Logger, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import SearchServiceBase from './services/search-base.service';
import SearchUserService from './services/search-user.service';
import { readFileSync } from 'fs';

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
            apiKey: configService.get<string>('ES_API_KEY'),
          },
          ssl: {
            ca: readFileSync('./http_ca.crt'),
            rejectUnauthorized: false,
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

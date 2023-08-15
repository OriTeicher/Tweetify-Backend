import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class ElasticSearchHealthIndicator extends HealthIndicator {
  constructor(private readonly elasticSearchService: ElasticsearchService) {
    super();
  }

  async pingCheck(key: string) {
    try {
      await this.elasticSearchService.ping();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Elasticsearch service is down',
        this.getStatus(key, false),
      );
    }
  }
}

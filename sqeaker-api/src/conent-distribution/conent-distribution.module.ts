import { Module } from '@nestjs/common';
import { ConentDistributionService } from './conent-distribution.service';
import { ConentDistributionGateway } from './conent-distribution.gateway';

@Module({
  providers: [ConentDistributionGateway, ConentDistributionService]
})
export class ConentDistributionModule {}

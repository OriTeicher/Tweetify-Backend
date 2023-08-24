import { Test, TestingModule } from '@nestjs/testing';
import { ConentDistributionGateway } from './conent-distribution.gateway';
import { ConentDistributionService } from './conent-distribution.service';

describe('ConentDistributionGateway', () => {
  let gateway: ConentDistributionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConentDistributionGateway, ConentDistributionService],
    }).compile();

    gateway = module.get<ConentDistributionGateway>(ConentDistributionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

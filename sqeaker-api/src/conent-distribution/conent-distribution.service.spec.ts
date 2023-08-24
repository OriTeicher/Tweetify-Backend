import { Test, TestingModule } from '@nestjs/testing';
import { ConentDistributionService } from './conent-distribution.service';

describe('ConentDistributionService', () => {
  let service: ConentDistributionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConentDistributionService],
    }).compile();

    service = module.get<ConentDistributionService>(ConentDistributionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

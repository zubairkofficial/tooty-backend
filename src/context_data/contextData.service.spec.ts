import { Test, TestingModule } from '@nestjs/testing';
import { ContextDataService } from './contextData.service';

describe('ContextDataService', () => {
  let service: ContextDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContextDataService],
    }).compile();

    service = module.get<ContextDataService>(ContextDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

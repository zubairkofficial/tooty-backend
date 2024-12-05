import { Test, TestingModule } from '@nestjs/testing';
import { ContextDataController } from './contextData.controller';

describe('ContextDataController', () => {
  let controller: ContextDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContextDataController],
    }).compile();

    controller = module.get<ContextDataController>(ContextDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

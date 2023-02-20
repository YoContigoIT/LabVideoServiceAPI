import { Test, TestingModule } from '@nestjs/testing';
import { CallRecordsController } from './call_records.controller';
import { CallRecordsService } from './call_records.service';

describe('CallRecordsController', () => {
  let controller: CallRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallRecordsController],
      providers: [CallRecordsService],
    }).compile();

    controller = module.get<CallRecordsController>(CallRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

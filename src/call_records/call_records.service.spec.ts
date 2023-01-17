import { Test, TestingModule } from '@nestjs/testing';
import { CallRecordsService } from './call_records.service';

describe('CallRecordsService', () => {
  let service: CallRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallRecordsService],
    }).compile();

    service = module.get<CallRecordsService>(CallRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

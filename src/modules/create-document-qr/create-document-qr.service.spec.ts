import { Test, TestingModule } from '@nestjs/testing';
import { CreateDocumentQrService } from './create-document-qr.service';

describe('CreateDocumentQrService', () => {
  let service: CreateDocumentQrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateDocumentQrService],
    }).compile();

    service = module.get<CreateDocumentQrService>(CreateDocumentQrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

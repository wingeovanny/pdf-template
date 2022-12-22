import { Test, TestingModule } from '@nestjs/testing';
import { CreateDocumentQrService } from './create-document-qr.service';
import { FileData } from './dto/create-create-document-qr.dto';

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

  it('should generate a QR code', async () => {
    const result = await service.generateQr();
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });



});

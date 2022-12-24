import { Test, TestingModule } from '@nestjs/testing';
import { CreateDocumentQrService } from '../../../../modules/create-document-qr/create-document-qr.service';
import { FileData } from '../../../../modules/create-document-qr/dto/create-create-document-qr.dto';

describe('CreateDocumentQrService', () => {

  let serviceQr: CreateDocumentQrService;


  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateDocumentQrService],
    }).compile();

    serviceQr = module.get<CreateDocumentQrService>(CreateDocumentQrService);
  });

  it('should be defined', () => {
    expect(serviceQr).toBeDefined();
  });

  it('should generate a QR code', async () => {
    const result = await serviceQr.generateQr();
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });





});

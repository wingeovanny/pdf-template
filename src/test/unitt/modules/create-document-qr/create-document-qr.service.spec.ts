import { Test, TestingModule } from '@nestjs/testing';
import { FileData } from 'src/modules/create-document-qr/dto/create-create-document-qr.dto';
import { CreateDocumentQrService } from '../../../../modules/create-document-qr/create-document-qr.service';
import { mockBufferResponse } from '../../mockData';

describe('CreateDocumentQrService', () => {
  let serviceQr: CreateDocumentQrService;

  const data: FileData = {
    template: 'templateqrfondo.html',
    data: [
      {
        branch: 'MACDONALS',
        sitebranch: 'AV PATRIA Y AMAZONAS',
        codesite: '298102',
        coderedmainsite: 'COD-001029',
        idnode: 'www.google.com',
      },
    ],
  };

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
    const result = await serviceQr.generateQr('www.google.com');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  // it('should return a buffer function generate only qr', async () => {
  //   const result = await serviceQr.generateQrPdf(data);
  //   expect(result.dataBuffer).toHaveProperty('buffer');

  // }, 15000);

  // it('should return a buffer generate pdf and qr', async () => {
  //   const result = await serviceQr.generateQrPdf(data);
  //   expect(result.dataBase64).toBe('string');
  // }, 15000);
});

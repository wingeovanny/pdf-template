import { Test, TestingModule } from '@nestjs/testing';
import { FileData } from 'src/modules/create-document-qr/dto/create-create-document-qr.dto';
import { CreateDocumentQrController } from '../../../../modules/create-document-qr/create-document-qr.controller';
import { CreateDocumentQrService } from '../../../../modules/create-document-qr/create-document-qr.service';
import { mockBufferResponse } from '../../mockData';

describe('CreateDocumentQrController', () => {
  let controller: CreateDocumentQrController;

  // const dataQr: FileData = {
  //   template: "templateqrfondo.html",
  //   data: {
  //     branch: "MACDONALS",
  //     sitebranch: "AV PATRIA Y AMAZONAS",
  //     codesite: "298102",
  //     coderedmainsite: "COD-001029",
  //     idnode: "www.google.com"
  //   }
  // }

  const mockFindOne = jest.fn(() => Promise.resolve(mockBufferResponse));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateDocumentQrController],
      providers: [CreateDocumentQrService],
    }).compile();

    controller = module.get<CreateDocumentQrController>(
      CreateDocumentQrController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should return a buffer', async () => {
  //   const result = await controller.generaPdfQR(dataQr);
  //   expect(result.dataBuffer).toHaveProperty('buffer');

  // }, 15000);
});

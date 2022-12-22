import { Test, TestingModule } from '@nestjs/testing';
import { CreateDocumentQrController } from './create-document-qr.controller';
import { CreateDocumentQrService } from './create-document-qr.service';


describe('CreateDocumentQrController', () => {
  let controller: CreateDocumentQrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateDocumentQrController],
      providers: [CreateDocumentQrService],
    }).compile();

    controller = module.get<CreateDocumentQrController>(CreateDocumentQrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });






});

import { Module } from '@nestjs/common';
import { CreateDocumentQrService } from './create-document-qr.service';
import { CreateDocumentQrController } from './create-document-qr.controller';
import { PdfHelper } from 'src/shared/pdf-generator';

@Module({

  controllers: [CreateDocumentQrController],
  providers: [CreateDocumentQrService, PdfHelper]
})
export class CreateDocumentQrModule { }

import { Module } from '@nestjs/common';
import { CreateDocumentQrService } from './create-document-qr.service';
import { CreateDocumentQrController } from './create-document-qr.controller';

@Module({
  controllers: [CreateDocumentQrController],
  providers: [CreateDocumentQrService]
})
export class CreateDocumentQrModule {}

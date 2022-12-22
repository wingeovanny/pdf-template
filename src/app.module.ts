import { Module } from '@nestjs/common';

import { CreateDocumentQrModule } from './modules/create-document-qr/create-document-qr.module';


@Module({
  imports: [CreateDocumentQrModule],

})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateDocumentQrModule } from './modules/create-document-qr/create-document-qr.module';

@Module({
  imports: [CreateDocumentQrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

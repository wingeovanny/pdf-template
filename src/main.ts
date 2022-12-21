import { CreateDocumentQrModule } from './modules/create-document-qr/create-document-qr.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('PDF Qr\'s')
    .setDescription('Files-Pdfs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [CreateDocumentQrModule],
  });

  SwaggerModule.setup('api', app, document);
  app.enableCors();

  await app.listen(3000);
}
bootstrap();

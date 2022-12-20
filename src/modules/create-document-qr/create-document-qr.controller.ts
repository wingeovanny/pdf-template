import { Controller, Get, Post, Body, Patch, Param, Delete, Header } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateDocumentQrService } from './create-document-qr.service';
import { FileData } from './dto/create-create-document-qr.dto';


@ApiTags('qr-files')
@Controller('qrfiles')
export class CreateDocumentQrController {

  constructor(private readonly createDocumentQrService: CreateDocumentQrService) { }

  @Post('qr-merchant')
  @ApiCreatedResponse({
    description: 'Pdf qr branch',
  })
  @Header('Content-Type', 'appication/pdf')
  getPdfRol(
    @Body() dataFile: FileData,
  ): Promise<any> {
    return this.createDocumentQrService.generatePdf(dataFile);
  }


}

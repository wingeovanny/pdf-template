import { Controller, Get, Post, Body, Patch, Param, Delete, Header, Headers } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateDocumentQrService } from './create-document-qr.service';
import { FileData } from './dto/create-create-document-qr.dto';


@ApiTags('qr-files')
@Controller('qrfiles')
export class CreateDocumentQrController {

  constructor(private readonly createDocumentQrService: CreateDocumentQrService) { }


  @Post('qr-generator')
  @ApiCreatedResponse({
    description: 'Pdf qr',
  })
  @Header('Content-Type', 'appication/pdf')
  generaPdfQR(@Headers() headers, @Body() dataQr: FileData): Promise<any> {
    return this.createDocumentQrService.generateQrPdf(dataQr);
  }




}

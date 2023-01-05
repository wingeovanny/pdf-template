import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Headers,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateDocumentQrService } from './create-document-qr.service';
import { BufferResponse, FileData } from './dto/create-create-document-qr.dto';

@ApiTags('qr-files')
@Controller('qrfiles')
export class CreateDocumentQrController {
  constructor(
    private readonly createDocumentQrService: CreateDocumentQrService,
  ) {}

  @Post('qr-generator')
  @ApiCreatedResponse({
    description: 'Pdf qr',
  })
  @Header('Content-Type', 'appication/pdf')
  generaPdfQR(@Body() dataQr: FileData): Promise<BufferResponse> {
    const filedata: FileData = {
      template: 'templateBaseFondo.html',
      data: [
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y sur',
          cashierNumber: '1',
          qr: '12345',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y AMAZONAS',
          cashierNumber: '2',
          qr: '67890',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y sur',
          cashierNumber: '3',
          qr: '19283',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y AMAZONAS',
          cashierNumber: '4',
          qr: 'www.google.com',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y sur',
          cashierNumber: '5',
          qr: 'www.google.com',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y AMAZONAS',
          cashierNumber: '1',
          qr: 'www.google.com',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y sur',
          cashierNumber: '2',
          qr: 'www.google.com',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y AMAZONAS',
          cashierNumber: '1',
          qr: 'www.google.com',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y sur',
          cashierNumber: '2',
          qr: 'www.google.com',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y AMAZONAS',
          cashierNumber: '1',
          qr: 'www.google.com',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y sur',
          cashierNumber: '2',
          qr: 'www.google.com',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y AMAZONAS',
          cashierNumber: '1',
          qr: 'www.google.com',
        },
        {
          merchant: 'MACDONALS',
          branch: 'AV PATRIA Y sur',
          cashierNumber: '1',
          qr: 'www.google.com',
        },
      ],
    };

    return this.createDocumentQrService.generateQrPdf(filedata).then((resp) => {
      return resp;
    });
  }
}

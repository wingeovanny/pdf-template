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
          branch: 'MACDONALS',
          sitebranch: 'AV PATRIA Y AMAZONAS',
          codesite: '1',
          coderedmainsite: 'COD-001029',
          qr: 'www.google.com',
        },
        {
          branch: 'MACDONALS',
          sitebranch: 'AV PATRIA Y AMAZONAS',
          codesite: '2',
          coderedmainsite: 'COD-001029',
          qr: 'www.youtube.com',
        },
        {
          branch: 'MACDONALS',
          sitebranch: 'AV PATRIA Y AMAZONAS',
          codesite: '3',
          coderedmainsite: 'COD-001029',
          qr: 'www.youtube.com',
        },
        // {
        //   branch: 'MACDONALS',
        //   sitebranch: 'AV PATRIA Y AMAZONAS',
        //   codesite: '4',
        //   coderedmainsite: 'COD-001029',
        //   qr: 'www.youtube.com',
        // },
        // {
        //   branch: 'MACDONALS',
        //   sitebranch: 'AV PATRIA Y AMAZONAS',
        //   codesite: '5',
        //   coderedmainsite: 'COD-001029',
        //   qr: 'www.youtube.com',
        // },
      ],
    };

    return this.createDocumentQrService.generateQrPdf(filedata).then((resp) => {
      //   console.log('resp', resp);
      return resp;
    });
  }
}

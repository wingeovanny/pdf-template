import { Injectable } from '@nestjs/common';
import { PdfHelper } from '../../shared/pdf-generator';
import { BufferResponse, FileData } from './dto/create-create-document-qr.dto';
import * as QRCode from 'qrcode'

@Injectable()
export class CreateDocumentQrService {

  private pdfHelper: PdfHelper

  constructor() {
    this.pdfHelper = new PdfHelper;
  }

  async generateQr() {
    try {
      return await QRCode.toDataURL('www.google.com', { width: 500 });
    } catch (err) {
      console.error(err)
    }
  }

  async generateQrPdf(info: FileData): Promise<BufferResponse> {

    const qr = await this.generateQr();

    info.data.qr = qr;

    const result = await this.pdfHelper.createPDF(info);

    const resultService = new BufferResponse();

    resultService.dataBuffer = result;

    resultService.dataBase64 = resultService.dataBuffer.toString('base64');

    return resultService;

  }

}

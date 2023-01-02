import { Injectable } from '@nestjs/common';
import { PdfHelper } from '../../shared/pdf-generator';
import { BufferResponse, FileData } from './dto/create-create-document-qr.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class CreateDocumentQrService {
  private pdfHelper: PdfHelper;

  constructor() {
    this.pdfHelper = new PdfHelper();
  }

  async generateQr(value: string) {
    try {
      return await QRCode.toDataURL(value, { width: 500 });
    } catch (err) {
      console.error(err);
    }
  }

  async generateQrPdf(info: FileData): Promise<BufferResponse> {
    await Promise.all(
      info.data.map(async (item: any) => {
        item.qr = await this.generateQr(item.qr);
      }),
    );

    let limiteData = 0;
    let limitPage = 0;

    switch (info.template) {
      case 'templateBase5x5.html':
        limitPage = 12;
        limiteData = this.obtenerLimite(info.data.length, limitPage);
        break;
      case 'templateBase10x10.html':
        limitPage = 2;
        limiteData = this.obtenerLimite(info.data.length, limitPage);
        break;
      default: //template de 1 solo qr con fondo. templateBaseFondo.html
        limitPage = 1;
        limiteData = info.data.length;
    }
    console.log(limiteData);
    const result = await this.pdfHelper.createDocumentPDFNveces(
      info,
      limiteData,
      limitPage,
    );
    const resultService = new BufferResponse();

    resultService.dataBase64 = result.toString('base64');

    return resultService;
  }

  obtenerLimite(limitData: number, limitPage: number): number {
    if (limitData % limitPage === 0) {
      return limitData;
    }
    return limitData + (limitPage - (limitData % limitPage));
  }
}

import { Injectable } from '@nestjs/common';
import { PdfHelper } from '../../shared/pdf-generator';
import {
  BufferResponse,
  dataTemplate,
  FileData,
} from './dto/create-create-document-qr.dto';
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
      info.data.map(async (item: dataTemplate) => {
        item.qr = await this.generateQr(item.qr);
      }),
    );

    const limitPage = 12;

    const limiteData = this.obtenerLimite(info.data.length, limitPage);

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

  obtenerLimite(num: number, multiploBase: number): number {
    return num + (multiploBase - (num % multiploBase));
  }
}

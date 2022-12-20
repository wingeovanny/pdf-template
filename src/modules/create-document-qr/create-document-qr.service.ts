import { Injectable } from '@nestjs/common';
import { PdfHelper } from 'src/shared/pdf-generator';
import { FileData } from './dto/create-create-document-qr.dto';


@Injectable()
export class CreateDocumentQrService {

  private pdfHelper: PdfHelper;

  async generatePdf(info: FileData): Promise<any> {
    return this.pdfHelper.createPDF(info);
  }


  // create(createCreateDocumentQrDto: FileData) {
  //   return 'This action adds a new createDocumentQr';
  // }

  // findAll() {
  //   return `This action returns all createDocumentQr`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} createDocumentQr`;
  // }

  // update(id: number, updateCreateDocumentQrDto: FileData) {
  //   return `This action updates a #${id} createDocumentQr`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} createDocumentQr`;
  // }


}

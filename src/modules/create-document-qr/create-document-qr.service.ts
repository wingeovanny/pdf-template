import { Injectable } from '@nestjs/common';
import { PdfHelper } from 'src/shared/pdf-generator';
import { FileData } from './dto/create-create-document-qr.dto';

import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as path from 'path';

@Injectable()
export class CreateDocumentQrService {

  constructor(private pdfHelper: PdfHelper) {
  }

  async generateQrPdf(info: FileData): Promise<any> {


    return this.pdfHelper.createPDF(info);

  }


}

import { Injectable } from '@nestjs/common';
import { PdfHelper } from 'src/shared/pdf-generator';
import { FileData } from './dto/create-create-document-qr.dto';

import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as path from 'path';

@Injectable()
export class CreateDocumentQrService {
  browser;

  fileOptions = {
    width: '21cm',
    height: '29.7cm',
    headerTemplate: '<p></p>',
    footerTemplate: '<p></p>',
    displayHeaderFooter: false,
    margin: {
      top: '0',
      bottom: '0',
    },
    printBackground: true,
    path: ''
  };
  constructor() {
    this.startBrowser();
    //this.registerHelpers();
  }

  async startBrowser() {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }

  private pdfHelper: PdfHelper;


  async generateQrPdf(info: FileData): Promise<any> {

    // return this.pdfHelper.createPDF(info);

    const templateHtml = fs.readFileSync(`./src/assets/templates/${info.template}`, 'utf8');

    console.log('data: ', templateHtml);

    const template = handlebars.compile(templateHtml);

    const html = template(info.data);
    const finalPageContent = eval('`' + html + '`');
    if (!this.browser) {
      await this.startBrowser();
    }
    const page = await this.browser.newPage();
    await page.setContent(`${finalPageContent}`, {
      waitUntil: 'networkidle0',
    });
    //await page.addStyleTag({ path: 'src/assets/bootstrap.min.css' });

    this.fileOptions.path = path.join('pdf', `${info.data.branch}.pdf`);
    const file = await page.pdf(this.fileOptions);
    await page.close();
    return file;
  }




}

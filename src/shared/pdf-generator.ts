import {
  contenidoHt,
  dataTemplate,
} from './../modules/create-document-qr/dto/create-create-document-qr.dto';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as handlebars from 'handlebars';
import path from 'path';
import * as puppeteer from 'puppeteer';
import { FileData } from 'src/modules/create-document-qr/dto/create-create-document-qr.dto';
import { ConsoleLogger } from '@nestjs/common';

export class PdfHelper {
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
    path: '',
  };
  constructor() {
    this.startBrowser();
  }

  async startBrowser() {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }

  public async createPDF(dataFile: FileData): Promise<Buffer> {
    const templateHtml = fs.readFileSync(
      `./src/assets/templates/${dataFile.template}`,
      'utf8',
    );

    const template = handlebars.compile(templateHtml);
    var mili = new Date();
    var milis = mili.getTime();

    const html = template(dataFile.data);

    const finalPageContent = eval('`' + html + '`');

    if (!this.browser) {
      await this.startBrowser();
    }
    const page = await this.browser.newPage();
    await page.setContent(`${finalPageContent}`, {
      waitUntil: 'networkidle0',
    });

    //this.fileOptions.path = path.join('pdf', `${'dato'}-${milis}.pdf`);

    const file = await page.pdf(this.fileOptions);
    await page.close();
    //  console.log(file);
    return file;
  }

  public async createDocumentPDF(dataFile: FileData): Promise<Buffer> {
    // ...
    var mili = new Date();
    var milis = mili.getTime();
    var finalPageContent = '';

    // Itera sobre el conjunto de datos y genera un PDF por cada iteración
    for (const datum of dataFile.data) {
      const templateHtml = fs.readFileSync(
        `./src/assets/templates/${dataFile.template}`,
        'utf8',
      );

      const template = handlebars.compile(templateHtml);
      // Genera el contenido HTML para la página actual
      const html = template(datum);

      // Agrega el contenido HTML de la página actual al contenido final del PDF
      finalPageContent += eval('`' + html + '`');
    }

    if (!this.browser) {
      await this.startBrowser();
    }
    const page = await this.browser.newPage();
    await page.setContent(`${finalPageContent}`, {
      waitUntil: 'networkidle0',
    });

    // this.fileOptions.path = path.join('pdf', `${'dato'}-${milis}.pdf`);
    // Genera el archivo PDF a partir del contenido final
    const file = await page.pdf(this.fileOptions);

    await page.close();

    return file;
  }

  public async createDocumentPDFNveces(
    dataFile: FileData,
    limitData: number,
    limitePage: number,
  ): Promise<Buffer> {
    var finalPageContent = '';

    var contador = 1;
    var aux: contenidoHt = {
      bodycap: '',
    };
    // Itera sobre el conjunto de datos y genera un PDF por cada iteración

    for (let i = 1; i <= limitData; i++) {
      var datum = dataFile.data[i - 1]; // Obtiene el dato para la página actual

      if (datum === undefined) {
        datum = {
          branch: '',
          sitebranch: '',
          codesite: '',
          coderedmainsite: '',
          qr: '',
        };
      }

      aux.bodycap += await this.createCardsDiv(datum);

      if (contador == limitePage) {
        const templateHtml = fs.readFileSync(
          `./src/assets/templates/${dataFile.template}`,
          'utf8',
        );

        const template = handlebars.compile(templateHtml);
        // Genera el contenido HTML para la página actual
        const html = template(aux);
        // Agrega el contenido HTML de la página actual al contenido final del PDF
        finalPageContent += eval('`' + html + '`');
        contador = 0;
        aux.bodycap = '';
        // console.log(finalPageContent);
      }
      contador++;
    }

    if (!this.browser) {
      await this.startBrowser();
    }
    const page = await this.browser.newPage();

    await page.setContent(`${finalPageContent}`, {
      waitUntil: 'networkidle0',
    });

    // Genera el archivo PDF a partir del contenido final
    const file = await page.pdf(this.fileOptions);

    await page.close();

    return file;
  }

  async createCardsDiv(datum: any) {
    return `
     <div>
         <div class="cards">
             <div class="body-primary">
                 <div class="content-qr"> <img src=${datum.qr} style="height:100% ; width: 100%;"></div>
                 <div class="fotter-qr">
                     <div class="text">${datum.branch}</div>
                     <div class="text">${datum.sitebranch}</div>
                     <div class="text">${datum.codesite}</div>
                 </div>
             </div>
             <div class="fotter-primary">${datum.coderedmainsite}</div>
         </div>
     </div> `;
  }
}

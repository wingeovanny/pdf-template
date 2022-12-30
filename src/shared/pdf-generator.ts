import { contenidoHt } from './../modules/create-document-qr/dto/create-create-document-qr.dto';
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

      aux.bodycap += `
                        <div>
                            <div class="cards">
                                <div class="body-primary">
                                    <div class="content-qr">    <img src=${datum.qr} style="height:100% ; width: 100%;"></div>
                                    <div class="fotter-qr">
                                        <div class="text">${datum.branch}</div>
                                        <div class="text">${datum.sitebranch}</div>
                                        <div class="text">${datum.codesite}</div>
                                    </div>
                                </div>
                                <div class="fotter-primary">${datum.coderedmainsite}</div>
                            </div>
                        </div> `;

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

      console.log('recorrer : ', i);
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

  async getPlantilla() {
    const templateFull = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>QR_A4_12</title>
    
      <style>
        body {
          background: rgb(204, 204, 204);
    
        }
    
        page[size="A4"] {
          background: #FFFFFF;
          width: 21cm;
          height: 29.7cm;
          display: block;
          margin: 0 auto;
          margin-bottom: 0.5cm;
          box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
        }
    
        @media print {
    
          body,
          page[size="A4"] {
            margin: 0;
            box-shadow: 0;
          }
        }
    
        .contenedor {
          display: grid;
          grid-template-columns: auto;
          justify-content: center;
          width: 20.9cm;
          height: 29.5cm;
    
        }
    
        .contenedor-main {
          display: grid;
          grid-template-columns: auto;
          justify-content: center;
          margin: 60px 90px 60px 90px;
          background-color: rgb(207, 232, 227);
        }
    
        .container-total {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr;
          grid-auto-columns: 1fr;
          /* gap: 0px 0px;
          grid-auto-flow: row; */
          background-color: rgb(207, 232, 227);
        }
    
        .cards {
          display: grid;
          grid-template-columns: 1fr;
          height: 6.6cm;
          width: 5.5cm;
          grid-template-rows: 1.5fr 0.5fr;
          grid-auto-rows: 1fr;
          gap: 0px 0px;
          grid-auto-flow: row;
          grid-template-areas:
            "body-primary"
            "fotter-primary";
          grid-area: cards;
          background-color: rgb(207, 232, 111);
    
        }
    
        .fotter-primary {
          justify-self: center;
          align-self: center;
          grid-area: fotter-primary;
          background-color: rgb(207, 232, 121);
    
        }
    
        .body-primary {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1.5fr 0.5fr;
          grid-auto-rows: 1fr;
          gap: 0px 0px;
          grid-auto-flow: row;
          grid-template-areas:
            "content-qr"
            "fotter-qr";
          grid-area: body-primary;
          background-color: rgb(207, 232, 22);
          border: 1px dashed black
        }
    
        .fotter-qr {
          justify-self: center;
          align-self: stretch;
          grid-area: fotter-qr;
    
          background-color: rgb(207, 232, 220);
    
        }
    
        .content-qr {
          justify-self: center;
          align-self: stretch;
          grid-area: content-qr;
          background-color: rgb(207, 232, 220);
    
        }

        .text {
            text-align: center;
          }

      </style>
    </head>
    
    <body>
    
      <page size="A4">
        <div class="contenedor">
          <div class="contenedor-main">
            <div class="container-total">                          
              {{{bodycap}}}
            </div>
          </div>
        </div>
      </page>
    </body>
    
    </html>`;

    return templateFull;
  }
}
